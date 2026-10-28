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

## Open Source Contributions

If you want to contribute a feature, please contact us 😊

## Related Repos

* [stemn-desktop](https://github.com/stemn/Stemn-Desktop) the production releases of the stemn-desktop app (produced from this src)
