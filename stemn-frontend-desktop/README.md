# Stemn Frontend Desktop

The Stemn desktop app: an Electron client that lists the changes the Stemn backend detects in a
project's cloud storage folder (Dropbox, Google Drive or the built-in `stemn` storage), previews and
compares file revisions, and commits them. It has three kinds of window:

* **main**: the full app (projects, changes, history, threads, files, settings)
* **menubar**: the small window that pops up from the tray icon (changes and commits of the active project)
* **preview**: one window per previewed file (revision timeline and compare)

It is a workspace package of the root `stemn-frontend` repo and shares most of its UI with the
website through `stemn-frontend-shared` (the `stemn-shared/*` alias, with `*.desktop.*` files taking
precedence over the generic ones).

## Requirements

* Node.js 22.22+ (Node 24 is what CI/dev use) and npm 10+ (npm 11 works)
* Run `npm install` **at the repo root**. There is one lockfile for all packages.
* Linux: the usual Electron runtime libraries (`libnss3`, `libgtk-3-0`, `libxss1`, `libasound2`, ...).
  If Electron aborts with *"The SUID sandbox helper binary was found, but is not configured correctly"*,
  fix the sandbox helper once:
  `sudo chown root:root node_modules/electron/dist/chrome-sandbox && sudo chmod 4755 node_modules/electron/dist/chrome-sandbox`
  (run from the repo root; repeat after reinstalling Electron). Don't disable the sandbox.
* A Stemn backend. `STEMN_ENV=local` (the default for `dev`) expects the API on http://localhost:3000 and the
  websocket server on http://localhost:8000, see `stemn-backend/local/README.md`.

## Commands

Run them from this folder, or from the repo root with the `desktop:` prefix (`npm run desktop:dev`, ...).

| Command | What it does |
| --- | --- |
| `npm run dev` | Builds main + preload in watch mode (into `out/`, so it never mixes with a production `dist/`), starts the renderer dev server (Vite, React Fast Refresh) on :5173 and launches Electron. Main/preload changes restart Electron. |
| `npm run build` | Production build into `dist/` (`dist/main`, `dist/preload`, `dist/renderer`). |
| `npm run start` | Runs the built app from `dist/` (no rebuild). |
| `npm run package` | Builds and packages a Linux AppImage plus an unpacked dir into `release/` (electron-builder). |
| `npm run package:win` / `package:mac` | Windows NSIS installer / macOS dmg+zip. Run them on that OS (Windows from Linux needs wine). |
| `npm run package:check` | Validates `electron-builder.yml` for all platforms without building. |
| `npm run test:e2e` | End-to-end test with Playwright driving Electron against the local backend (see below). |
| `npm run typecheck` | `tsc --noEmit` for the app, the shared desktop code, the tests and the build config. |

`dev`, `build` and `start` go through `scripts/electron-vite.mjs`, which removes `ELECTRON_RUN_AS_NODE`
from the environment: some tools (editor terminals that are themselves Electron apps) export it, and it
makes the Electron binary start as plain Node.

### Environment

| Variable | Used by | Meaning |
| --- | --- | --- |
| `STEMN_ENV` | build / dev | `local` (dev default), `staging`, `production` (build default) or `custom` ([stemn-frontend-shared/config/stemnEnv.cjs](../stemn-frontend-shared/config/stemnEnv.cjs)). Baked into `GLOBAL_ENV.API_SERVER` / `WEBSOCKET_SERVER` / `WEBSITE_URL`. E.g. `STEMN_ENV=local npm run build`. |
| `API_SERVER`, `WEBSOCKET_SERVER`, `WEBSITE_URL` | build | Server urls for `STEMN_ENV=custom`. |
| `SENTRY_DSN` | build | Enables Sentry (`@sentry/browser`) in the renderers, like the website. |
| `STEMN_DESKTOP_DEV_PORT` | dev | Renderer dev server port (default 5173). |
| `STEMN_USER_DATA_DIR` | runtime | Use another profile directory (state, logs, file cache), e.g. for tests or a second dev instance. |
| `STEMN_NO_DEVTOOLS` | dev runtime | Don't open the DevTools in development. |
| `STEMN_LOG_RENDERER_CONSOLE`, `STEMN_LOG_WEBSOCKET` | runtime | Copy renderer console warnings/errors / received websocket events into the main log. |

Logs are written by electron-log to `<userData>/logs/main.log` (Linux: `~/.config/Stemn/logs/main.log`).

## Architecture

```
app/
  main/          Electron main process: windows, tray, IPC handlers, local OAuth callback server (127.0.0.1:49554),
                 stemn-file:// protocol, redux store (source of truth), websocket client, auto update
  preload/       Preload script: exposes window.stemnDesktop (contextBridge) - the only way renderers reach Electron
  renderer/      main / menubar / preview windows (index.html + routes + pages)
  shared/        store setup, reducers, store-sync middleware and IPC helpers used by main and renderers
  static/        fonts and images (the renderer public dir)
electron.vite.config.ts, electron-builder.yml
tests/           Playwright e2e
```

**Toolchain**: electron-vite 6 (Vite 8 / Rolldown) builds three targets. Main and preload are bundled
completely (CommonJS, no externals except `electron` and Node built-ins), so the packaged app ships no
`node_modules`; that's also why every library is a devDependency. The renderers use
`@vitejs/plugin-react` (Oxc, React Fast Refresh in dev). There is no Babel: the source is plain ES modules
with JSX in `.jsx`/`.tsx` files.

Conventions shared with the website (all in `electron.vite.config.ts`, see also `stemn-frontend-shared/config`):

* `resolve.extensions` tries `.desktop.ts/.tsx/.js/.jsx` first (the website tries `.web.*` first). The main
  process build tries `.electron.*` before that: the shared modals' `index.electron.js` export just the modal
  name, so React components never end up in the main process bundle.
* Aliases: `stemn-shared`, `theme`, `route-actions`, `reducer`, `package-json`, `stemn-frontend-desktop`.
* CSS: the standard convention, `*.module.(s)css` files are CSS modules (class names `<File>_<class>-<hash>`,
  `@value x from "theme"` imports from `app/theme.module.css`), every other stylesheet is global CSS
  (global sheets use the `--theme-*` custom properties). Sass is compiled with `sass` (Dart Sass).
* `GLOBAL_ENV` is defined per target: `APP_TYPE: 'desktop'`, `APP_THREAD: 'electron'` (main) or
  `'renderer'` (windows), `NODE_ENV`, `STEMN_ENV`, `API_SERVER`, `WEBSOCKET_SERVER`, `WEBSITE_URL`, `SENTRY_DSN`.

**State**: the main-process redux store is the source of truth. Renderers create a replica from
`stemnDesktop.getInitialState()`, send their actions to main (`forwardToMain`), and main replays every
reduced action into all windows (`forwardToRenderer`, `meta.scope: 'local'`). Thunks and promise actions
run where they are dispatched; `aliased` actions call main-process functions through the
`FunctionLibrary` (file cache, windows, provider paths, file saving, updates). Actions scoped to a window
(`meta.scope: ['main']`, or a route with `state.meta.scope`) are forwarded to that window, e.g. clicking a
commit in the menubar navigates the main window. Persisted keys are listed in `app/main/json-storage.js`
(`<userData>/storage/state.json`).

**Routing**: react-router 8 through the shared compatibility layer (`stemn-shared/routing`) with
`createHashRouter` (the windows are `file://` pages). Route objects are in each window's `routes.js`.

## Security

All windows run with Electron 45's defaults kept on: `contextIsolation: true`, `nodeIntegration: false`,
`sandbox: true` (`app.enableSandbox()`), `webSecurity: true`, and a Content-Security-Policy meta tag. The
old app used `electron.remote` and node integration in every window; there are **no `remote` call sites
left** (the `@electron/remote` fallback was not needed). Renderers only get the small API in
[app/preload/index.ts](app/preload/index.ts) (`window.stemnDesktop`): initial state, store-sync
messages, window controls, a folder picker, and `shell` open/reveal. Each call maps to one handler in
[app/main/ipc.js](app/main/ipc.js), which checks that the sender is one of our pages.

* Windows only ever load the bundled renderer (`file://` in production, the dev server in development).
  Other navigations and `window.open` are blocked and http(s)/mailto links open in the system browser.
  No remote content is loaded with node integration (there is no node integration).
* Downloaded files are served to the previews through `stemn-file://cache/...`, which only reads inside
  `<userData>/FileCache`.
* The OAuth callback server only listens on 127.0.0.1.
* IPC messages are cleaned with `app/shared/ipc/serialize.js` (no functions/promises/sockets cross processes).

## End-to-end test

```sh
# backend running with the seed data (stemn-backend: local/start.sh && local/seed.sh), X display available
npm run test:e2e                      # builds with STEMN_ENV=local, then runs tests/e2e.spec.ts
E2E_SKIP_BUILD=1 npm run test:e2e     # reuse dist/
```

It launches the built app with a throwaway profile, logs in as `priya.raman@stemn.local`, and checks:
window security settings, login, the project list, websocket events, the provider folder picker (the native
dialog is stubbed), the CubeSat project's cloud folder link, a full change -> preview -> commit -> history
cycle, markdown and PDF preview windows, the menubar window, and that nothing threw in any process.
Screenshots go to `qa/` (git-ignored). Because Dropbox/Drive need real accounts, the test plays the storage
sync client through the API: it downloads `desktop-sync-check.md` into a temp folder, edits it and uploads
the edit as a new revision; everything after that is the app. Each run adds one commit
(`Desktop sync check <timestamp>`) to the CubeSat project.

## Packaging and releases

`electron-builder.yml` (electron-builder 26): Linux AppImage + dir, Windows NSIS (x64), macOS dmg + zip,
icons from `build/` (`icon.ico`, `icon.icns`, `icons/*.png`), the `stemn://` protocol, and a GitHub
`publish` provider (`Stemn/Stemn-Desktop`) that electron-updater uses for auto updates.

TODO: the old release flow (`scripts/deploy.sh` pushing `dist/` to the `stemn-desktop` repo, AppVeyor and
Travis building it, `Stemn-Updates/updates.json` for electron-simple-updater) was removed with the old
toolchain. Releases now need a CI job per OS running `npm run package:<os>` with signing credentials and
`--publish always` (GitHub token); that pipeline hasn't been set up yet.
