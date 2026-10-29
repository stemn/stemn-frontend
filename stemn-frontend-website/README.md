# Stemn Frontend Website

Anyone can get the [Stemn Website](https://stemn.com/) running locally and develop new features. The entire frontend is open-source!

### Table of Contents

1. [Development](#development)
2. [Branches](#branches)
3. [Contributing](#contributing)

## Development

### Install

1. Make sure you have `git` and Node.js 24 (`.nvmrc`; 22.22+ works) installed.
2. Clone the parent repo: `stemn-frontend`.
3. Run `npm install` **at the repo root** (npm workspaces – this installs the website and `stemn-frontend-shared`).

All the commands below can be run from the repo root or from this folder.

### Development server

* `npm run dev` starts the Vite 8 dev server with React Fast Refresh on [http://localhost:8081/](http://localhost:8081/) (override with `PORT=...`).
  Port 3000 is used by the API and 8000 by the websocket server.

### Backend / `STEMN_ENV`

The backend urls are baked in at build time from `STEMN_ENV`
(table in `stemn-frontend-shared/config/stemnEnv.cjs`, applied by `config/globalEnv.js`):

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

* `npm run build` builds the production bundle with Vite to `build/client` (and copies the express server to `build/server`)
* `npm run serve` serves this build on [http://localhost:8081/](http://localhost:8081/) (`PORT=...` to change)

### Docker

`Dockerfile` (Node 24, multi-stage): builds the website in the workspace and runs the express server on a slim
`node:24-alpine` image as the `node` user. Build it from the repository root:

```sh
docker build -f stemn-frontend-website/Dockerfile --build-arg STEMN_ENV=staging -t stemn-website .
docker run -p 8081:8081 stemn-website
```

### webpack 5 fallback

The previous webpack 5 + Babel toolchain is kept working as a fallback (`config/webpack.config.*.js`) until it is
retired. It builds the same source with the same conventions:

* `npm run dev:webpack` webpack-dev-server with React Fast Refresh on :8081
* `npm run build:webpack` production build to `build/client` (+ `build/server`)

The git tag `webpack5-fallback` marks the last commit that was built with webpack only.

### Type checking

* `npm run typecheck` runs `tsc --noEmit` for the app (`tsconfig.json`) and the Vite config (`tsconfig.node.json`).
  Vite (Oxc) only strips types, so type errors never break the build.

### Layout and conventions

```
index.html            Vite entry html (also the webpack fallback's html template)
vite.config.mts       Vite config
config/               globalEnv.js (GLOBAL_ENV), webpack 5 fallback configs
public/               images/ and static/ (fonts, Autodesk viewer, video), served as-is at /images and /static
src/client/assets/javascripts/   the app (app/index.jsx is the entry)
src/client/assets/styles/        global stylesheets and the theme (theme.module.css)
src/server/           express server for the production build
```

* Imports: `stemn-shared/*` (shared code), `pages/*`, `modules/*`, `layout/*`, `route-actions`, `reducer`, `theme` (in `@value` imports).
  `.web.*` files win over the generic ones (the desktop app resolves `.desktop.*`), so platform specific modules
  are plain ES modules picked by the bundler (no runtime `require` switches).
* JSX lives in `.jsx` / `.tsx` files. Default-exported components are named functions or classes (React Fast Refresh).
* Styles: `*.module.(s)css` files are CSS modules (`import classes from './Foo.module.scss'`, class names
  `<File>_<class>-<hash>`); every other stylesheet is global CSS. CSS modules import theme values with
  `@value primary from "theme"`; global stylesheets use the `--theme-*` custom properties
  (`stemn-shared/assets/css/theme-variables.css`). Sass is Dart Sass.

### Stack

Vite 8 (Rolldown, Oxc, React Fast Refresh) with a webpack 5 fallback, React 19, Redux 5 / react-redux 9, react-router 8 (through the
compatibility layer in `stemn-frontend-shared/src/routing`, which keeps the react-router v3 / react-router-redux APIs the app was written against).

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
