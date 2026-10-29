# Stemn Frontend

This repo contains all of Stemn's frontend code.

## Packages

* [stemn-frontend-website](./stemn-frontend-website) Source code for the Stemn website
* [stemn-frontend-shared](./stemn-frontend-shared) Code shared between `stemn-frontend-website` and `stemn-frontend-desktop` (consumed as source through the `stemn-shared/*` alias), plus the build conventions both apps use (`config/`)
* [stemn-frontend-desktop](./stemn-frontend-desktop) Source code for the Stemn desktop (Electron) app
* [stemn-frontend-admin](./stemn-frontend-admin) This is a placeholder - ignore this.

## Requirements

* Node.js 22.22+ (see `.nvmrc`; Node 24 works) and npm 10+

## Usage

The repo root is an [npm workspace](https://docs.npmjs.com/cli/using-npm/workspaces) containing
`stemn-frontend-shared`, `stemn-frontend-website` and `stemn-frontend-desktop`. There is a single
`package-lock.json` at the root.

```sh
npm install          # install everything (run at the repo root)
npm run dev          # website: Vite dev server with React Fast Refresh on http://localhost:8081
npm run build        # website: Vite production build -> stemn-frontend-website/build
npm run serve        # serve the production build on http://localhost:8081 (PORT=... to change)
npm run dev:webpack  # website: the webpack 5 fallback dev server (same port)
npm run build:webpack # website: the webpack 5 fallback production build (same output dir)
npm run typecheck    # tsc --noEmit (type errors never block the builds)
npm test             # unit tests of every workspace that has them
```

The website talks to the Stemn backend. By default (`STEMN_ENV=local`) it expects the API on
http://localhost:3000 and the websocket (Primus) server on http://localhost:8000.
See [stemn-frontend-website/README.md](./stemn-frontend-website/README.md) for the other environments.

## Running the full stack locally

The backend lives in the sibling `stemn-backend` repository (branch `modernize/2026`). Everything below is
documented in detail in `stemn-backend/local/README.md`.

```sh
# 1. backend: MongoDB + Redis in Docker, API on :3000, websocket server on :8000
cd ../stemn-backend && local/start.sh        # local/stop.sh stops it; local/smoke-test.sh re-checks the API

# 2. demo data (idempotent): 8 users, 14 projects, files, threads, comments, follows
local/seed.sh                                 # all demo accounts use the password "password123"
                                              # e.g. ada.lovelace@stemn.local, priya.raman@stemn.local

# 3. website
cd ../stemn-frontend && npm install && npm run dev   # http://localhost:8081
```

Port 8080 is deliberately avoided because the development container's noVNC server listens there.

## Desktop

The Electron app lives in [stemn-frontend-desktop](./stemn-frontend-desktop) (Electron 45,
electron-vite 6 / Vite 8, React 19, the same shared code as the website). From the repo root:

```sh
npm run desktop:dev        # main + preload in watch mode, renderer dev server with Fast Refresh, launches Electron
npm run desktop:build      # production build -> stemn-frontend-desktop/dist (STEMN_ENV=production unless set)
npm run desktop:start      # run the built app
npm run desktop:package    # Linux AppImage + unpacked dir -> stemn-frontend-desktop/release
npm run desktop:test:e2e   # Playwright + Electron end-to-end test against the local backend (needs a display)
npm run desktop:typecheck
```

`desktop:dev` talks to the local backend (`STEMN_ENV=local`: API :3000, websocket :8000). On Linux the
Electron sandbox helper must be setuid root, and `ELECTRON_RUN_AS_NODE` must not leak into the app (the
scripts strip it). See [stemn-frontend-desktop/README.md](./stemn-frontend-desktop/README.md) for the
architecture, the security model (context isolation + sandbox + preload bridge, no `remote`),
environment variables and packaging for Windows/macOS.

## Open Source Contributions

If you want to contribute a feature, please contact us 😊

## Related Repos

* [stemn-desktop](https://github.com/stemn/Stemn-Desktop) the production releases of the stemn-desktop app (produced from this src)
