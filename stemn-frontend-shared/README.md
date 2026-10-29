# Stemn Frontend Shared

This code is shared between `stemn-frontend-website` and `stemn-frontend-desktop`.

It is an npm workspace package of the root `stemn-frontend` repo (run `npm install` at the repo root).
Its runtime dependencies are declared in this package's `package.json` and hoisted to the root `node_modules`.
The website and the desktop app consume the source directly through the `stemn-shared/*` alias / tsconfig path
(no build step, no `npm link`).

* Platform specific files use the `.web.*` / `.desktop.*` suffix; the website resolves `.web.*` first and the
  desktop app `.desktop.*` first (the Electron main process build `.electron.*`, then `.desktop.*`). They are plain
  ES modules: there are no runtime `GLOBAL_ENV.APP_TYPE ? require(a) : require(b)` switches. The webpack fallback of
  the website additionally resolves `.webpack.js` first, for modules that use Vite-only APIs (`import.meta.glob`).
* The shared modals (`misc/Modal/*Modal`, ...) register their component in `index.js` and export the modal name;
  `index.electron.js` exports the name only, so the main process never bundles React components.
* Styles: `*.module.(s)css` are CSS modules, everything else is global CSS (`assets/css/*` are the global sheets the
  apps `@import`). See `config/styles.cjs`.
* `config/` holds the build conventions shared by the website (Vite + webpack fallback) and the desktop app:
  `styles.cjs` (CSS-module class names, Sass options) and `stemnEnv.cjs` (the `STEMN_ENV` backend table).
  `npm test` runs their tests.
* `src/desktop` is desktop-only code. Modules there that import `electron` or Node built-ins run in the
  Electron main process only (they are called through `FunctionLibrary` aliased actions); renderer code
  reaches native features through `src/desktop/bridge.js` (`window.stemnDesktop`, the preload bridge).
* `src/routing` is a compatibility layer that exposes the react-router v3 / react-router-redux
  APIs (`Link` with `query`/`activeClassName`, `push`/`replace`/`goBack` action creators,
  `routerMiddleware`, `routerReducer` with `locationBeforeTransitions`, `withRouteProps`) on top of react-router 8.
