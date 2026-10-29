# Stemn Frontend

This repo contains all of Stemn's frontend code.

## Packages

* [stemn-frontend-website](./stemn-frontend-website) Source code for the Stemn website
* [stemn-frontend-shared](./stemn-frontend-shared) Code shared between `stemn-frontend-website` and `stemn-frontend-desktop` (consumed as source through the `stemn-shared/*` alias), plus the build conventions both apps use (`config/`)
* [stemn-frontend-desktop](./stemn-frontend-desktop) Source code for the Stemn desktop (Electron) app
* [tests/e2e](./tests/e2e) Playwright end-to-end tests of the website against a real backend

## Documentation

* [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): how the packages, the runtime (Redux, HTTP, websocket, routing) and the conventions fit together
* [docs/DECISIONS.md](./docs/DECISIONS.md): decision records of the 2026 modernisation, including the webpack fallback policy
* [docs/TYPESCRIPT.md](./docs/TYPESCRIPT.md): the incremental TypeScript conversion (strict ratchet, Redux typing conventions, module order)

## Requirements

* Node.js 24 (`.nvmrc`, what CI and the Docker image use; 22.22+ works) and npm 10+

## Usage

The repo root is an [npm workspace](https://docs.npmjs.com/cli/using-npm/workspaces) containing
`stemn-frontend-shared`, `stemn-frontend-website`, `stemn-frontend-desktop` and `tests/e2e`. There is a single
`package-lock.json` at the root.

```sh
npm install          # install everything (run at the repo root)
npm run dev          # website: Vite dev server with React Fast Refresh on http://localhost:8081
npm run build        # website: Vite production build -> stemn-frontend-website/build
npm run serve        # serve the production build on http://localhost:8081 (PORT=... to change)
npm run dev:webpack  # website: the webpack 5 fallback dev server (same port)
npm run build:webpack # website: the webpack 5 fallback production build (same output dir)
npm run typecheck    # tsc --noEmit: website, desktop, e2e + the strict TypeScript ratchet (type errors never block the builds)
npm run typecheck:strict # only the strict project: the converted modules of tsconfig.strict.json, see docs/TYPESCRIPT.md
npm run lint         # ESLint (--max-warnings 0) + Prettier check; npm run lint:fix / npm run format fix them
npm test             # unit tests (Vitest)
npm run test:e2e     # website end-to-end tests (Playwright) against the local backend, see tests/e2e/README.md
```

The website talks to the Stemn backend. By default (`STEMN_ENV=local`) it expects the API on
http://localhost:3000 and the websocket (Primus) server on http://localhost:8000.
See [stemn-frontend-website/README.md](./stemn-frontend-website/README.md) for the other environments.

A husky pre-commit hook runs ESLint and Prettier on the staged files (lint-staged). `HUSKY=0` skips it.

## Continuous integration

GitHub Actions (`.github/workflows`):

* `ci.yml` on every pull request and on pushes to `staging` / `production`: lint, typecheck, unit tests, builds (website with
  Vite, website with the webpack fallback, desktop), the website Docker image, and `e2e`.
* `e2e.yml` (reusable, `workflow_call`): starts the backend (`.github/actions/stemn-backend`: checks out the private
  `stemn-backend` with a read-only deploy key, `local/start.sh` + `local/seed.sh`), then runs the website Playwright suite and the
  desktop suite under `xvfb-run`. Traces, screenshots and backend logs are uploaded when it fails.
* `codeql.yml` (JavaScript/TypeScript code scanning) and `dependency-review.yml` (blocks pull requests that add dependencies with
  high-severity advisories). Renovate (`renovate.json`) opens grouped dependency updates against `staging`.

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
