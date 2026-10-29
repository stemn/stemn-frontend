# Stemn Frontend

This repo contains all of Stemn's frontend code.

## Packages

* [stemn-frontend-website](./stemn-frontend-website) Source code for the Stemn website
* [stemn-frontend-shared](./stemn-frontend-shared) Code shared between `stemn-frontend-website` and `stemn-frontend-desktop` (consumed as source through the `stemn-shared/*` webpack alias)
* [stemn-frontend-desktop](./stemn-frontend-desktop) Source code for the Stemn desktop (Electron) app. **Not yet modernised** – it is not part of the npm workspace and still uses its own (2019) toolchain.
* [stemn-frontend-admin](./stemn-frontend-admin) This is a placeholder - ignore this.

## Requirements

* Node.js 22.22+ (see `.nvmrc`; Node 24 works) and npm 10+

## Usage

The repo root is an [npm workspace](https://docs.npmjs.com/cli/using-npm/workspaces) containing
`stemn-frontend-shared` and `stemn-frontend-website`. There is a single `package-lock.json` at the root.

```sh
npm install          # install everything (run at the repo root)
npm run dev          # website dev server with HMR on http://localhost:8081
npm run build        # production build -> stemn-frontend-website/build
npm run serve        # serve the production build on http://localhost:8081 (PORT=... to change)
npm run typecheck    # tsc --noEmit (type errors never block the webpack build)
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

## Open Source Contributions

If you want to contribute a feature, please contact us 😊

## Related Repos

* [stemn-desktop](https://github.com/stemn/Stemn-Desktop) the production releases of the stemn-desktop app (produced from this src)
