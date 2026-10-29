# Stemn Frontend Website

Anyone can get the [Stemn Website](https://stemn.com/) running locally and develop new features. The entire frontend is open-source!

### Table of Contents

1. [Development](#development)
2. [Branches](#branches)
3. [Contributing](#contributing)

## Development

### Install

1. Make sure you have `git` and Node.js 22.22+ (`.nvmrc`) installed.
2. Clone the parent repo: `stemn-frontend`.
3. Run `npm install` **at the repo root** (npm workspaces – this installs the website and `stemn-frontend-shared`).

All the commands below can be run from the repo root or from this folder.

### Development server

* `npm run dev` starts webpack-dev-server with React Fast Refresh on [http://localhost:8081/](http://localhost:8081/) (override with `PORT=...`).
  Port 3000 is used by the API and 8000 by the websocket server.

### Backend / `STEMN_ENV`

The backend urls are baked in at build time from `STEMN_ENV` (see `config/getStemnEnv.js`):

| STEMN_ENV    | API_SERVER                  | WEBSOCKET_SERVER                   | WEBSITE_URL             |
|--------------|-----------------------------|------------------------------------|-------------------------|
| `local`      | http://localhost:3000       | http://localhost:8000              | http://localhost:8081   |
| `staging`    | https://staging.stemn.com   | https://staging.stemn.com:8443     | https://staging.stemn.com |
| `production` | https://stemn.com           | https://stemn.com:8443             | https://stemn.com       |
| `custom`     | `$API_SERVER`               | `$WEBSOCKET_SERVER`                | `$WEBSITE_URL`          |

`npm run dev` defaults to `local`, `npm run build` defaults to `production`
(e.g. `STEMN_ENV=local npm run build` for a production build against a local backend).
Set `SENTRY_DSN` at build time to enable Sentry error reporting.

### Build Production

* `npm run build` builds the production bundle to `build/client` (and copies the express server to `build/server`)
* `npm run serve` serves this build on [http://localhost:8081/](http://localhost:8081/) (`PORT=...` to change)
* `npm run analyse` builds and opens webpack-bundle-analyzer

### Type checking

* `npm run typecheck` runs `tsc --noEmit`. TypeScript is only type-checked; Babel transpiles it, so type errors never break the build.

### Stack

webpack 5, Babel 8, React 19, Redux 5 / react-redux 9, react-router 8 (through the compatibility layer in
`stemn-frontend-shared/src/routing`, which keeps the react-router v3 / react-router-redux APIs the app was written against),
sass + CSS modules (`*.global.(s)css` files are global, every other style file in the app / shared code is a CSS module).

## Branches

This project has 2 main branches:

* `staging` - staging.stemn.com
* `production` - stemn.com

## Contributing

* Fork this repo
* Follow the __Development__ guide above
* Submit a MR targeting the `staging` branch
* Make sure the CI pipeline is passing
* We will review and merge ASAP
