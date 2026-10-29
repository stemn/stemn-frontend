# Architecture

How the Stemn frontend fits together. For the reasoning behind the choices see [DECISIONS.md](./DECISIONS.md).

## Repository

An npm workspace with a single lockfile at the root:

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
  the PCB/gerber viewer, the pipeline graph, and the Autodesk viewer for CAD.

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

`npm run lint` (ESLint 10 + Prettier), `npm run typecheck`, `npm test` (Vitest), `npm run test:e2e` (website, Playwright)
and `npm run desktop:test:e2e` (Electron, Playwright). GitHub Actions run all of them on every pull request,
plus both website builds, the desktop build, the Docker image, CodeQL and dependency review. See the root README.
