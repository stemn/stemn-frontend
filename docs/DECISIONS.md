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

## ADR-009: Unified diffs in one lazy viewer, driven by a server-side manifest

* Status: accepted (the diff-core PR, with stemn-backend's diff route, ADR-022 there)
* Decision: two revisions of a CAD file open in `FileDiff` (`stemn-frontend-shared/src/misc/FileDiff`): a unified view with A and B
  overlaid and coloured by class (added, removed, modified, moved, unchanged), an A → B slider, a per-entity swap, class filters
  with counts, "changes only", an entity panel with attribute deltas, and a side-by-side view with linked cameras. The classes
  come from the backend's manifest (`GET /sync/diff/...`); the client only draws. The drawing rules live in `diff.utils.ts`
  without three.js, so the 2D viewers of the other file types reuse them. The contract is in [`DIFF-VIEWERS.md`](DIFF-VIEWERS.md).
* Why: the founder's requirement that users can tell what changed between revisions; diffing on the server keeps STEP parsing out
  of the browser and caches each pair once.
* Consequences:
  - The viewer is a lazy chunk (about 8 kB gzipped plus the shared three.js chunk the CAD preview already loads). CI checks that the
    website's main chunks stay within 2% of `stemn-frontend-website/bundle-size-baseline.json` (448.6 kB gzipped on staging
    `36e579b5`), so new viewers must stay behind `import()`.
  - A pending diff is followed through `DIFF/DIFF_COMPLETE` (`Websocket/eventMap/diff.js` → `diff.events.ts`, no reducer: only an
    open viewer cares) with polling as a fallback.
  - Formats the backend cannot diff (proprietary CAD, Autodesk-converted deployments) keep the original side-by-side previews and
    say so.


## ADR-010: PCB and electronics previews and diffs on the 2D diff viewer, rendered on the server

* Status: accepted (the PCB diff PR, with stemn-backend's PCB converter, ADR-024 there)
* Decision: KiCad boards and schematics, Eagle boards, Gerber layers, Excellon drill files and zips of a Gerber set (the `pcb`
  viewer type, `PreviewPcb/pcb.utils.ts` `pcbExtensions`, the same list as the backend's `core/pcb/isSupported.ts`) are rendered
  by the backend's KiCad converter into a layered SVG and shown by `PreviewPcb` on the 2D diff viewer's canvas
  (`Svg2dDiffView/SvgDiffCanvas`: pan, zoom, fit, layer toggles; mask, paste, fab and courtyard layers start hidden). Two revisions
  open in `PcbDiffView`, the shared `Svg2dDiffView` with the PCB drawing's address: the same toolbar, filters, counts, slider,
  entity panel and shortcuts as every diff viewer, and the class colours applied to each entity's `data-entity-id` groups on every
  layer. A folder's Gerber files shown as one board (`.gerber` assemblies) are rendered part by part and drawn together.
* Why: the founder's diff plan (workstream B). The previous PCB viewer parsed Gerber, KiCad and Eagle files in the browser with
  a vendored copy of three.js (36 000 lines) and crashed on the seeded Gerbers (`parse_gerber … is not a constructor`); server-side
  conversion gives KiCad's own geometry, one drawing for the preview and the diff, and no parser in the browser.
* Consequences:
  - The old viewer (`PreviewPcb/viewer/**`), its webpack and lint exclusions and the `@stemn/whats-that-gerber` dependency are
    removed: a file is a PCB file by its extension, as on the backend. Gerber files with other names (`.cmp`, `.sol`, ...) are
    listed but not previewed (FUTURE-WORK in stemn-backend lists more formats).
  - `PreviewPcb` (about 1.5 kB gzipped) and `PcbDiffView` (0.4 kB) are lazy chunks over the 2D viewer's chunks; the main chunks
    stay within the bundle-size baseline.
  - The render records are the CAD renders' with `cadProvider: 'kicad'`, so the render actions, websocket events and failure
    messages are the same; the web and desktop render downloads keep a PCB render's address like an open-source CAD render's.

## ADR-011: Civil and architecture diffs: an IFC property panel, and one shared 2D SVG diff viewer

* Status: accepted (workstream C of `plans/file-diff-viewers.md`, with stemn-backend's `aec` and `dxf` adapters, ADR-025 there)
* Decision:
  - **IFC** models diff in the 3D viewer (`FileDiffView`) as they are. When the manifest's adapter is `aec`, the entity panel adds the
    IFC property panel (`FileDiff/IfcPanel`, its own lazy chunk) and a storey filter. The panel shows the selected product's
    attributes, property sets and quantities, read from its glTF node (`userData.stemn.ifc`), and marks what changed from A.
    The storey filter hides the products on the other storeys, both in the canvas and in the panel. The IFC preview
    (`PreviewIfc`) is `PreviewCadOss` with the same panel, through two new optional props: `onIsolate` and `hiddenIds`.
  - **DXF and DWG** renders are SVGs. They diff in a 2D viewer that owns no file type, `FileDiff/Svg2dDiffView`:
    - `svg2d.utils.ts`: view boxes and the moved-entity placement along the slider, pure and unit-tested.
    - `svgDocument.ts`: sanitised parsing, entities by `data-entity-id`, layers, class appearances on fill, stroke and
      currentColor, the background.
    - `SvgDiffCanvas`: A over B, or one pane, with pan, zoom and fit on a shared view box. It also draws a plain preview.
    - `Svg2dDiffView`: the view, reusing the toolbar, entity panel, load status and state of the 3D viewer, plus layer toggles.

    `DxfDiffView` only says where a revision's SVG is (`downloadRenderFile/.../drawing.svg`). `PreviewDrawing` is the DXF/DWG
    preview on the same canvas.
  - The 3D viewer's chrome is split into shared pieces that every viewer uses: `DiffToolbar`, `DiffEntityPanel` (with `details`
    for a viewer's own rows), `DiffLoadStatus`, `useDiffLoad` and `useDiffViewState`.
* Why:
  - The founder asked for civil and architecture support in the unified diff.
  - IFC models are glTF on the client like CAD, so they need their BIM data next to the geometry, not another viewer.
  - Workstreams B (PCB) and E (simulation) build on the same pieces. PCB wraps `Svg2dDiffView` like DXF does, and needs the
    multi-element entities, `data-paint`, `payloadRef.at` rotations, backgrounds and default-hidden layers that are already in.
* Consequences:
  - The main bundle grows by 0.5 kB gzipped (448.7 → 449.2 kB; Vite split the shared jsx runtime differently), within the 2%
    budget.
  - The new lazy chunks, gzipped: `DxfDiffView` 1.5 kB and `SvgDiffCanvas` 4.1 kB plus 0.5 kB CSS (no three.js),
    `PreviewDrawing` 1.1 kB, `IfcPanel` 0.8 kB plus 0.4 kB CSS, `PreviewIfc` 0.6 kB.
  - Picking thin lines checks a few pixels around the pointer. A drawing's text uses the browser's sans-serif. Every SVG is
    sanitised (no scripts, `foreignObject`, `on*` handlers or `javascript:` links) even though the API serves it under
    `default-src 'none'`.

## ADR-012: Additive manufacturing: 3MF in the CAD diff, G-code in a layer viewer of its own

* Status: accepted (workstream D of the diff plan, with stemn-backend ADR-026)
* Decision: 3MF files keep the `autodesk` viewer type and diff in the glTF diff viewer: the backend now converts each build item to
  one glTF node (its placement in the node, its object's mesh in its own frame), so moved, re-meshed, added and removed objects get
  their classes, and the entity details show an item's material and colour from its node's `extras.stemn`. G-code (`gcode`, `gco`,
  `g`, `nc`) gets a viewer type of its own: the backend converts it into a toolpath (`toolpath.bin`: per layer its start point and
  each move's end, kind and speed), which `PreviewGcode` draws with three.js lines layer by layer, coloured by feature, with a layer
  slider, travel moves on demand and a legend. Its diffs open in `FileDiff/GcodeDiffView` (a lazy chunk, like ADR-011's 2D
  diff viewer) with the toolbar, state, shortcuts and entity panel every diff viewer shares; it loads the two toolpaths and
  draws them with `PreviewGcode/ToolpathDiff`, which draws every layer of A and B with `unifiedAppearance` (or `sideBySideAppearance`), slides moved layers from A's placement
  to B's, hides layers above a height, and overlays the moves of the selected modified layer that only A (red) or only B (green)
  extrudes.
* Why: the founder asked for additive manufacturing explicitly. A layer is the unit printers and slicers think in, and comparing two
  layers' moves (a set difference on 10 µm-quantised segments) is cheap enough to do on every selection in the browser, so the
  manifest stays one record per layer. Lines rather than extruded tubes keep a print of millions of moves drawable.
* Consequences:
  - The G-code code is in lazy chunks on the three.js chunk the CAD viewer loads (sizes in the PR); the website's main chunks
    did not grow.
  - `.g` is G-code (Autodesk's BRL-CAD `.g` is shadowed).
  - The entity panel sorts labels in number order (Layer 2 before Layer 10), and named numbers (a layer's path length per feature)
    read as `outer-wall 75.1 mm, inner-wall 74.6 mm` in the deltas table.
  - Not done: the G-code text as a second tab, extruded line widths, per-feature visibility toggles, print time estimates
    (the toolpath carries speeds, not accelerations).
