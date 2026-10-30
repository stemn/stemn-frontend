# Architecture

How the Stemn frontend fits together. For the reasoning behind the choices see [DECISIONS.md](./DECISIONS.md).

## Repository

A pnpm workspace (`pnpm-workspace.yaml`, isolated `node_modules`) with a single `pnpm-lock.yaml` at the root:

| Package | What it is |
| --- | --- |
| `stemn-frontend-website` | The website (stemn.com): a React 19 SPA built with Vite 8 (webpack 5 fallback), served by a small express server |
| `stemn-frontend-desktop` | The Electron 45 app (electron-vite 6): main process, sandboxed preload, three renderer windows |
| `stemn-frontend-shared` | Source shared by both apps (`stemn-shared/*` alias, no build step) and the build conventions both apps use (`config/`) |
| `tests/e2e` | Playwright end-to-end tests of the website against a real backend |

The backend (`stemn-backend`, a separate private repository) provides the REST API (`/api/v1`, :3000 locally) and a
Primus websocket server (:8000). The frontend talks to both directly. Their URLs are baked in at build time from
`STEMN_ENV` (`stemn-frontend-shared/config/stemnEnv.cjs`).

## Runtime architecture (both apps)

```
React 19 components (class + function) ──► react-redux 9 ──► Redux 5 store
        │                                                       ▲
        │ dispatch(action)                                      │ reducers (immer)
        ▼                                                       │
middleware: thunk · auth · throttle · httpPackage/httpTransform (axios, `http: true` actions)
            · websocket (Primus rooms) · redux-promise-middleware · toastsError · routerMiddleware
```

* **State**: one Redux store. The website persists `auth` with redux-persist. In the desktop app the main-process store is the
  source of truth and the renderers hold replicas synced over IPC (see `stemn-frontend-desktop/README.md`).
* **HTTP**: actions with `http: true` + `payload: { url, method, params }` are executed by the httpPackage middleware
  (axios, auth header from the store). Results land as `<TYPE>_PENDING/_FULFILLED/_REJECTED`.
* **Realtime**: `stemn-shared/misc/Websocket` joins Primus rooms (project, thread, file...). Incoming events are mapped to
  refetch actions (`eventMap/*`).
* **Routing**: react-router 8 data routers (`createBrowserRouter` on the website, `createHashRouter` in Electron) through
  `stemn-shared/routing`. This compatibility layer keeps the react-router v3 / react-router-redux API the code was written
  against: `push`/`replace` actions, `routing.locationBeforeTransitions` with a parsed `query`, `Link` with `query`, and `withRouteProps`.
* **Modals**: components register themselves in `ModalRegistry` (`registerModal(name, Component)`). Actions open them by name
  (`showModal({ modalType })`). Shared modals export only the name to the Electron main process (`index.electron.js`).
* **Previews**: `PreviewFile` picks a viewer by file type: pdf.js, CodeMirror, markdown (markdown-it + KaTeX), images,
  the PCB/gerber viewer, the pipeline graph, and a CAD viewer (see below).

## CAD previews

The backend converts CAD files with one of two providers, chosen per deployment (stemn-backend `STEMN_CAD_PROVIDER`):
Autodesk Platform Services (SVF) or its own OpenCascade converter (glTF 2.0). The frontend shows each render in the
viewer for the provider that made it. Everything lives in `stemn-frontend-shared/src/misc/Files/PreviewFile/`:

| Piece | What it does |
| --- | --- |
| `PreviewFile.utils.ts` | CAD extensions (the `autodesk` viewer type, kept under that name): Autodesk's formats plus `brep`, `brp`, `ply`, `3mf` |
| `PreviewCadSwitch/` | Provider-neutral: checks WebGL, requests the render (`renderFile`: websocket `RENDER/RENDER_FILE` -> `POST /sync/render`), shows the progress messages, then picks the viewer from `fileRender.cadProvider` |
| `PreviewCadOssLoader/`, `PreviewCadOss/` | The open-source viewer (lazy chunk): three.js via @react-three/fiber. Fetches the `.glb` from `GET /api/v1/sync/downloadRender/{projectId}/{fileId}/{revisionId}` with the user's bearer token, orbit controls, fit to view, wireframe, section plane, a part list (one entry per glTF node with geometry) |
| `PreviewCadLoader/`, `PreviewCad/` | The Autodesk viewer, unchanged: loads `viewer3D.min.js` from Autodesk's CDN, then shows the SVF from `downloadRenderFile` |
| `Messages/Messages.jsx` | Render failures (`RENDER_FAILED` from either provider) show the conversion error |

The contract with the backend:

* The render record and the `RENDER/RENDER_DOWNLOAD`, `RENDER/RENDER_COMPLETE` and `RENDER/RENDER_FAILED` events carry
  `cadProvider: 'autodesk' | 'opencascade'`. A missing value means Autodesk (renders made before the field). Do not confuse
  it with `provider`, which is the file's storage provider (dropbox, drive, stemn).
* `eventMap/render.js` passes `cadProvider` to `renderFileDownload`, and the Files reducer keeps it on the `fileRenders` entry.
  On the desktop app, Autodesk renders are still downloaded and unzipped by the file cache. Open-source renders are a single `.glb`,
  so the viewer fetches them directly, as on the website.
* Open-source renders also record `outputs` (`parts`, `triangles`, `size` in mm, the converter version and duration).
  The converter writes a PNG thumbnail as well, served at `downloadRenderFile/.../thumbnail.png`.

**Entity ids (the seam for file diffs).** The converter gives every glTF node a stable id in `node.extras.stemn.id`
(`'bracket-assembly/base-plate'`, `'bracket-assembly/bolt#2'`), and three's GLTFLoader copies it to `object.userData.stemn`.
`nodesFromScene` (`PreviewCadOss.utils.ts`) maps every node by that id. For glbs written before the ids existed, it falls back to the
path of glTF node names, numbering repeated siblings the same way. The viewer keys its part list by id and shows the node's
glTF name as the label. It hands `{ root, nodesById }` to an optional `onSceneReady` prop and to `CadSceneContext` for children,
and gives every mesh its own material. A later diff layer can therefore colour or ghost any entity by id without touching the others.
The matching scene model (`IRenderScene`, `IRenderSceneEntity`, served as `downloadRenderFile/.../scene.json` and recorded
as `outputs.scene`) is typed in `PreviewCadOss/scene.types.ts`; the backend's diff engine reads it, the client reads the diff
manifest instead (File diffs below).

Part colours for parts without a material use the palette of the converter's thumbnails, so a part has the same colour
in both. The e2e test `tests/e2e/specs/cad.spec.ts` uploads the backend's shared `assembly.step` sample and checks the
viewer.

## File diffs

Two revisions of a CAD file open in the diff viewer (`stemn-frontend-shared/src/misc/FileDiff`, ADR-009): `FileCompareInner`
mounts `FileDiffLoader` (lazy) for the unified and side-by-side modes, `FileDiffView` loads the backend's manifest
(`GET /api/v1/sync/diff/{projectId}/{fileId}/{revisionA}/{revisionB}`, pending until both revisions are converted, then
`DIFF/DIFF_COMPLETE`) and both glbs, and draws them with the rules in `diff.utils.ts`. The contract for the other file types is
[`DIFF-VIEWERS.md`](DIFF-VIEWERS.md).

## Source layout (website)

```
index.html                         Vite entry html (also the webpack fallback template)
src/client/assets/javascripts/
  app/          entry (index.jsx), store, root reducer, init (http, auth, websocket, sentry)
  pages/        one folder per route (Page.jsx + Page.container.jsx + index.js), routes.jsx, routeActions.js
  modules/      website-only building blocks (Header, Footer, Analytics, ...)
  layout/       page layouts
src/client/assets/styles/          global stylesheet + theme.module.css
public/                            images/ and static/ (Autodesk viewer, fonts, video), served as-is
src/server/                        express server for the production build
```

Shared code lives in `stemn-frontend-shared/src/misc/<Feature>/` (components, `*.actions`, `*.reducer`, containers),
`src/routing`, `src/utils`, `src/redux` (middleware), `src/pages` (login/register/password pages), and `src/desktop`
(Electron-only modules).

## Conventions

* **Platform files**: `X.web.js` (website), `X.desktop.js` (desktop), `X.electron.js` (Electron main process). They are
  picked by the bundler's extension resolution, never by runtime switches.
* **Styles**: `*.module.(s)css` are CSS modules (`import classes from './X.module.scss'`, `@value primary from "theme"`).
  Everything else is global CSS, and global sheets use `--theme-*` custom properties.
* **Components**: JSX only in `.jsx`/`.tsx`. Default exports are named components or HOC compositions
  (`export default connect(...)(Component)`), so React Fast Refresh works.
* **Imports**: `stemn-shared/*`; on the website also `pages/*`, `modules/*`, `layout/*`, `route-actions`, `reducer`.

## Quality gates

`pnpm run lint` (ESLint 10 + Prettier), `pnpm run typecheck`, `pnpm test` (Vitest), `pnpm --filter stemn-frontend-website run size`
(main bundle gzip size against the baseline + 2%, after `pnpm run build`), `pnpm run test:e2e` (website, Playwright)
and `pnpm run desktop:test:e2e` (Electron, Playwright). GitHub Actions run all of them on every pull request,
plus both website builds, the desktop build, the Docker image, CodeQL and dependency review. See the root README.
