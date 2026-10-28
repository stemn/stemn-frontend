# Stemn Frontend Shared

This code is shared between `stemn-frontend-website` and `stemn-frontend-desktop`.

It is an npm workspace package of the root `stemn-frontend` repo (run `npm install` at the repo root).
Its runtime dependencies are declared in this package's `package.json` and hoisted to the root `node_modules`.
The website consumes the source directly through the `stemn-shared/*` webpack alias / tsconfig path
(no build step, no `npm link`).

* Platform specific files use the `.web.*` / `.desktop.*` suffix; the website resolves `.web.*` first.
* `src/routing` is a compatibility layer that exposes the react-router v3 / react-router-redux
  APIs (`Link` with `query`/`activeClassName`, `push`/`replace`/`goBack` action creators,
  `routerMiddleware`, `routerReducer` with `locationBeforeTransitions`, `withRouteProps`) on top of react-router 8.
