# Decisions

Architecture decision records for the 2026 modernisation of the Stemn frontend (PRs #34 onwards).
Each entry states the context, the decision and its consequences. Newer entries can supersede older ones.

## ADR-001: Vite 8 is the website toolchain, webpack 5 stays as a fallback

* Status: accepted (PR #34). The fallback policy can only be changed by the founder.
* Context: the website was on webpack 5 + Babel 8. The desktop app had already moved to electron-vite 6 / Vite 8.
  Vite 8 (Rolldown + Oxc) builds the website in about 5 s, where webpack takes about 68 s. It also gives native ESM
  dev with React Fast Refresh and is the current ecosystem default.
* Decision: `npm run dev` / `npm run build` use Vite. The webpack 5 configs stay working behind `npm run dev:webpack` /
  `npm run build:webpack`, and CI builds both on every PR. The git tag `webpack5-fallback` marks the last webpack-only commit.
* Consequences: the fallback needs a few webpack-only artefacts: `config/webpack.config.*.js`, Babel inside babel-loader,
  css-loader, and `*.webpack.js` modules for Vite-only APIs (`fileTypeIcons.webpack.js` replaces `import.meta.glob` with
  `require.context`). Renovate groups these dependencies. **Retiring the fallback** means deleting those files, the
  `*:webpack` scripts, their CI matrix entry and the dependencies. It is a single PR once the founder decides.

## ADR-002: Standard source conventions instead of bundler plugins

* Status: accepted (PR #34)
* Context: the code relied on webpack-era idioms: legacy `@connect` decorators, JSX in `.js`, CommonJS
  `module.exports = cond ? require(a) : require(b)` platform switches, `require.context`, and every stylesheet being a CSS module.
  The desktop app emulated all of these in Vite with a custom Babel plugin and a custom CSS-modules plugin.
* Decision: change the code, not the bundlers. HOC composition instead of decorators, `.jsx`/`.tsx` for JSX, ES modules
  only, platform implementations picked by extension resolution (`.web.*` on the website, `.desktop.*` in the desktop
  renderers, `.electron.*` then `.desktop.*` in the Electron main process), and `*.module.(s)css` for CSS modules.
* Consequences: stock Vite with no Babel at all, in both apps. Class names stay `<File>_<class>-<hash>` in every bundler
  (`stemn-frontend-shared/config/styles.cjs`). Global stylesheets cannot use `@value`, so they use `--theme-*` custom properties.

## ADR-003: ESLint 10 with maintained plugins instead of ESLint 9 + eslint-plugin-react/import

* Status: accepted (PR #35). This deviates from the original programme, which named ESLint 9.
* Context: ESLint 9 is end-of-life (npm marks 9.39.x "no longer supported"). `eslint-plugin-react` (last release 04/2025)
  and `eslint-plugin-import` do not support ESLint 10.
* Decision: ESLint 10 flat config with `typescript-eslint`, `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` 7,
  `eslint-plugin-react-refresh` and `eslint-plugin-import-x`. Prettier does the formatting (`eslint-config-prettier`).
  Lint must pass with `--max-warnings 0`.
* Consequences: legacy debt that cannot be fixed mechanically is switched off in `eslint.config.mjs` with a comment
  (UNSAFE_ lifecycles, React Compiler rules, `cloneElement`, array-index keys). Re-enable these rules as code is
  converted (see ADR-007).

## ADR-004: Test pyramid: Vitest + Playwright against the real backend

* Status: accepted (PR #35)
* Decision: unit tests use Vitest, next to the code. The website end-to-end suite (`tests/e2e`) and the desktop suite
  (`stemn-frontend-desktop/tests`) use Playwright against a real backend started from `stemn-backend` (`local/start.sh` +
  `local/seed.sh`), locally and in CI. No API mocks.
* Consequences: CI checks out the private backend with a read-only deploy key (`STEMN_BACKEND_DEPLOY_KEY`), so fork
  PRs skip e2e. Tests find seed data by name and create their own throwaway accounts and projects. The backend fixture is
  a composite action (`.github/actions/stemn-backend`) and the suites run in a reusable workflow (`e2e.yml`, `workflow_call`),
  so other workflows (package-manager migration, other app shells) can reuse them.

## ADR-005: CI gates

* Status: accepted (PR #35)
* Decision: GitHub Actions on every PR: lint, typecheck, unit, builds (Vite, webpack fallback, desktop), website Docker
  image, e2e (website + desktop under xvfb), CodeQL, and dependency review (blocks high-severity advisories). A PR is
  merged only when everything is green. Renovate opens grouped updates weekly.

## ADR-006: Maintained libraries only

* Status: accepted (PR #36)
* Decision: replace unmaintained or legacy libraries:
  - moment → dayjs, through `stemn-shared/utils/date`, which pins moment's output formats
  - redux-form → react-hook-form
  - icepick → immer
  - PropTypes removed (React 19 ignores them)
* Consequences: reducers have unit tests that pin their immutability semantics (unchanged branches keep their references).

## ADR-007: Incremental TypeScript

* Status: proposed (PR 5, left open for the founder's review)
* Decision: enable `allowJs` + `checkJs` incrementally and convert module by module to strict TypeScript, starting with
  the shared routing, Websocket, Auth and Files modules. PR 5 adds a conversion playbook.

## ADR-008: An open-source CAD viewer next to the Autodesk viewer

* Status: accepted (the CAD viewer PR, with stemn-backend's open-source CAD conversion provider)
* Decision: CAD previews are shown by the viewer that matches the render's `cadProvider`. Renders made by the backend's
  OpenCascade converter (`cadProvider: 'opencascade'`, a glTF 2.0 `.glb`) open in `PreviewCadOss`: three.js through
  @react-three/fiber, with orbit controls, fit to view, wireframe and section toggles and a part list. Every other render,
  including the ones made before the field existed, opens in the Autodesk viewer exactly as before. The Autodesk viewer's
  scripts are only loaded from Autodesk's CDN for Autodesk renders, so a deployment that converts with OpenCascade (the EU
  edition by default) never contacts Autodesk from the browser.
* Why: the EU edition must not send CAD files or viewer requests to a US company, and an open viewer needs no account or
  quota. The founder asked to keep Autodesk as an alternative rather than replace it.
* Consequences: three.js is a lazy chunk (about 160 kB gzipped) loaded only for open-source renders. @react-three/drei
  was left out because it pulls in some 35 packages (hls.js, mediapipe, troika, ...) for the two helpers the viewer needs;
  orbit controls and the glTF loader come from `three/addons`.
