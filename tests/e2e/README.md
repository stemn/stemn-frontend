# Website end-to-end tests

Playwright (Chromium) tests of the website's core flows against a real Stemn backend.

```sh
# 1. backend with the demo data (stemn-backend repository)
local/start.sh && local/seed.sh          # API :3000, websocket :8000

# 2. from the repo root: production build against the local backend, then the tests
STEMN_ENV=local npm run build
npm run test:e2e                         # serves build/ on :8081 (E2E_PORT=... to change)

# or against a running dev server / deployment
E2E_BASE_URL=http://localhost:8081 npm run test:e2e
```

| Variable | Default | Meaning |
| --- | --- | --- |
| `E2E_BASE_URL` | (unset) | Test this website instead of serving `stemn-frontend-website/build` |
| `E2E_PORT` | `8081` | Port for the served build |
| `E2E_API_URL` / `E2E_WEBSOCKET_URL` | `http://localhost:3000` / `:8000` | Backend used by the fixtures |

`fixtures/backend.ts` waits for the backend and its seed data, and creates throwaway accounts and projects through the
API (`registerAccount`, `createProjectWithFiles`). Seed data is found by name, never by id, so the suite runs on any freshly
seeded database. `fixtures/test.ts` adds `adaPage` (logged in as Ada through the form) and fails every test that throws an
uncaught exception in the page.

Each run registers new accounts, creates a project with a PNG and posts one comment on a seeded thread.

`specs/cad.spec.ts` uploads `fixtures/cad/assembly.step` (a copy of the backend's shared CAD sample) to the seeded CubeSat
project as its owner, under a new name each run, and checks that the open-source glTF viewer draws the model and lists its two
parts. It needs a backend that converts with OpenCascade (stemn-backend `STEMN_CAD_PROVIDER=opencascade`, the
converter container that `local/start.sh` starts). Against an Autodesk-only backend it fails, because the render never reaches
the open-source viewer.
`specs/diff.spec.ts` uploads `fixtures/cad/bracket-assembly-v1.step` and then `-v2.step` as the second revision of one file in
the CubeSat project, opens the file, picks **Compare: Unified Diff** and the two revisions on the timeline, and checks the diff
viewer: the five class counts, the entity panel, the four change colours on the canvas, the A → B slider, the entity details and
the side-by-side view with linked cameras. It needs a backend with the diff route (stemn-backend ADR-022) and the OpenCascade
converter.
`specs/diff-aec.spec.ts` uploads the backend's civil and architecture pairs (`fixtures/aec`), an IFC building and a DXF floor plan,
each as two revisions of one file, and checks:
- the class counts, the entity rows, and the class colours (canvas pixels for IFC, the SVG elements' computed colour and opacity
  for DXF);
- the IFC property panel and storey filter;
- the 2D slider, layer toggles and side-by-side view;
- the IFC and DXF previews.

It needs a backend whose CAD converter reads IFC and DXF (stemn-backend ADR-025).

`specs/pcb.spec.ts` uploads `fixtures/pcb/blinky-v1.kicad_pcb` (and `-v2` as its second revision, copies of the backend's shared
PCB samples) to the CubeSat project, checks the layered preview (status, KiCad's colours, a hidden mask layer, a layer toggled
off), then the unified diff: one entity of each class with the ids `fixtures/pcb/samples.json` lists, the class colours on each
revision's copy of the entities in the drawing, the entity details (a footprint turned 90°, swapped from 0603 to 0805, removed)
and side by side. It needs a backend with the PCB converter (stemn-backend ADR-024, the container `local/start.sh` starts).
`specs/additive.spec.ts` uploads the backend's additive samples (`fixtures/additive`): `tube-v1.gcode` alone, checking the G-code
layer viewer (status line, legend, layer slider, travel), then `tube-v1.gcode` → `tube-v2.gcode` and `parts-v1.3mf` →
`parts-v2.3mf` as two revisions each, checking the diff viewer: the class counts and entity rows of `samples.json`, every change
colour on the canvas, the moved distance, the moves only one revision extrudes in the modified layer (11 only in B), the layer
height slider, side by side with linked cameras, and the 3MF items' materials. Like the CAD specs it needs a backend with the
OpenCascade converter (stemn-backend ADR-026 for 3MF build items and G-code).
On failure, traces, screenshots and videos are in `test-results/` (`npx playwright show-trace <trace.zip>`).

In CI the reusable workflow `.github/workflows/e2e.yml` starts the backend with the composite action
`.github/actions/stemn-backend` and runs this suite and the desktop suite (under xvfb).
