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
On failure, traces, screenshots and videos are in `test-results/` (`npx playwright show-trace <trace.zip>`).

In CI the reusable workflow `.github/workflows/e2e.yml` starts the backend with the composite action
`.github/actions/stemn-backend` and runs this suite and the desktop suite (under xvfb).
