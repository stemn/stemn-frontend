# Diff viewers: the contract

How Stemn shows what changed between two revisions of a file, and what a new file type has to provide to get the same
viewer. The product plan is [`plans/file-diff-viewers.md`](plans/file-diff-viewers.md); this document is the contract that
workstream A (diff core + 3D CAD) delivered and that workstreams B to E (PCB, AEC, additive, simulation) build on.

## The pieces

```txt
revision A, revision B
  │  converter service (cad-converter today; kicad, ifcopenshell, lib3mf, vtk later) writes a render + its scene model
  ▼
stemn-backend  adapter (core/diff/adapters/<type>.ts)  ── IScene ──▶  engine (core/diff: match + compare)
  │  GET /api/v1/sync/diff/{projectId}/{fileId}/{revisionA}/{revisionB}  →  IDiffManifest (cached in object storage)
  ▼
stemn-frontend  FileDiff/diff.client.ts (pending → DIFF/DIFF_COMPLETE)  →  a viewer that draws A and B by diff.utils' rules
```

* **Scene model** (`@stemn/types` `ISceneEntity`, mirrored in `stemn-frontend-shared/src/misc/FileDiff/diff.types.ts`):
  `{ id, kind, label, parentId, transform, bounds, geometryHash, signature, attributes, payloadRef }`.
  * `id`: stable across revisions where the format has one (STEP instance paths `bracket-assembly/bolt#2`, KiCad UUIDs and
    reference designators, IFC GlobalIds, DXF handles). Repeated names carry `#n`: the engine matches those by position.
  * `transform`: 4×4, column major, **world** frame (the adapter composes parent-relative transforms). `bounds`: world AABB.
  * `geometryHash`: a hash of the geometry in the entity's own frame (moving it must not change the hash).
  * `signature`: named numbers for matching entities whose ids changed (`volume`, `area`, `faces`, `extents` sorted, ...).
  * `attributes`: what the entity panel shows and the engine compares (dimensions, material, net, layer, properties).
  * `payloadRef`: where the viewer finds the entity in the render (`{ node }` for a glTF node; an SVG element id; a layer index).
* **Adapter** (`IDiffAdapter`, `services/api/src/types/diff.ts`): `name`, `version` (bump it whenever its scenes or matching
  change: cached manifests are keyed by it), `derived` (attributes that follow from the geometry: listed for modified entities
  but never a reason on their own, e.g. triangle counts), `isSupported({ remote, extension })`, `source({ fileId, revisionId })`
  (`complete | pending | failed | missing`, without starting anything) and `scene({ remote, fileId, revisionId, user, roomId })`
  (converts the revision if needed and returns its `IScene`).
* **Engine** (`core/diff`): pairs entities (instance groups, then ids, then shape + position with Hungarian assignment) and
  classifies each one: **added**, **removed**, **modified** (geometry hash or a non-derived attribute changed), **moved** (only the
  world placement changed), **unchanged**.
* **Manifest** (`IDiffManifest`): `{ status: 'complete', version, adapter: { name, version }, fileId, revisionA, revisionB,
  units, counts, entities, created, duration }`. Each entity record: `{ id, idA, idB, kind, label, parentId, class,
  match: { method: 'id' | 'instance' | 'signature' | null, confidence }, changes: [{ attribute, a, b, delta? }],
  move: { translation, distance, rotation } | null, centreA, centreB, payloadRefA, payloadRefB }`.

## The route

`GET /api/v1/sync/diff/{projectId}/{fileId}/{revisionA}/{revisionB}?roomId=&force=` (A is the older revision).

| Answer | When |
| --- | --- |
| `200 IDiffManifest` | both revisions are converted (computed in milliseconds, then served from `diffs/<A>/<B>/<adapter>-<version>.json`) |
| `200 { status: 'pending' }` | a revision is not converted yet: the API converts both in the background and sends `DIFF/DIFF_COMPLETE` `{ fileId, revisionA, revisionB, adapter, counts }` (or `DIFF/DIFF_FAILED` `{ ..., error }`) to the user's room, `roomId` and the project room |
| `480 DIFF_NOT_SUPPORTED` | no adapter reads the format (proprietary CAD, or a deployment that converts with Autodesk): compare side by side |
| `4xx/580 DIFF_FAILED` | a revision could not be converted (`data.error` is the render's error, `data.revisionId` which one) |
| `404 REVISION_NOT_FOUND` | a revision is not a revision of the file |

`force=true` computes the manifest again. The client (`diff.client.ts` `loadDiff`) asks again on `DIFF/DIFF_COMPLETE` and polls
every 3 s while pending, in case the websocket is not connected.

## The viewer rules

`stemn-frontend-shared/src/misc/FileDiff/diff.utils.ts` holds the rules every viewer follows (no three.js in it; unit-tested):

| Class | Unified view | Side by side |
| --- | --- | --- |
| Added | B solid, green `#2f9e58`, outline on hover | B green |
| Removed | A at 30% opacity, red `#d64541`, in its A position, depth-tested but drawn after opaque geometry and not writing depth; the panel says "Removed in B" | A red |
| Modified | B solid amber `#e8a317`, A ghosted at 25% in place; the **A → B slider** crossfades their opacities; a per-entity **swap** shows A solid and B ghosted; the panel lists the attribute deltas | A and B amber |
| Moved | B solid blue `#3a7bd5`, A ghosted, a thin displacement line between the centres; the slider moves B from A's placement to its own | A and B blue |
| Unchanged | B neutral grey `#a7adb5` | neutral grey |

* **Filters** (one toggle per class, with its count): on draws the class with its treatment and lists it in the entity panel;
  off draws it as neutral context (removed entities disappear) and leaves it out of the panel. Default: all but Unchanged.
* **Changes only** hides all neutral geometry. Models over 4 million triangles (A + B) start with it on, and say so.
* **Entity panel**: rows by class, then label; a click selects the entity, outlines it and fits the camera to it; the details show
  the class summary ("Moved 60 mm", "Removed in B"), a rename or a match by shape with its confidence, the deltas table and the swap.
* **Side by side**: the two panes' cameras move together (`FileDiffView/cameraLink.ts`).
* **Lazy loading**: `FileDiffLoader` (main bundle, a few lines) imports `FileDiffView` with three.js and the glTF loader only when a
  diff is opened; three.js is the same chunk the CAD preview uses. CI fails when the main chunks grow beyond
  `stemn-frontend-website/bundle-size-baseline.json` + 2% (`npm run size --workspace stemn-frontend-website`).

### Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `1` – `5` | Toggle the Added, Removed, Modified, Moved and Unchanged filters |
| `C` | Changes only |
| `U` / `S` | Unified view / side by side |
| `[` / `]` | Slider 10% towards A / towards B |
| `A` / `B` | Slider fully to A / fully to B |
| `X` | Swap A and B for the selected entity |
| `F` | Fit the selection (or the model) |
| `Esc` | Clear the selection |

The `?` button in the toolbar lists them too (`diffShortcuts`). They are ignored while typing in a form field.

## Where it shows

`FileCompare`: for CAD files (`getViewerType` `autodesk`) the compare menu offers **Compare: Unified Diff**, and with two
revisions selected both the unified and the side-by-side modes open the diff viewer (`FileCompareInner`). Files the API cannot
diff fall back to the original side-by-side previews with a notice. In the commit and changes views (`FileCompare` with two revisions), CAD files open in the unified mode.

## Worked example: a PCB adapter (workstream B)

**1. Converter.** The KiCad container writes, per revision, the layered SVG the 2D viewer draws and `scene.json` with one
entity per footprint, track group and zone. Ids are the footprint UUIDs (`fp:3f2c...`) and net names (`net:/USB_D+`).

**2. Adapter** (`stemn-backend` `services/api/src/core/diff/adapters/pcb.ts`, in the backend's code style):

```ts
// printed circuit boards: kicad pcb files, converted by the kicad container
export const pcb: IDiffAdapter = {
  name: 'pcb',
  version: 1,
  derived: [
    'area',
    'pads',
  ],
  isSupported: ({ extension }) => ['kicad_pcb'].includes(extension.toLowerCase()),
  source: async ({ fileId, revisionId }) => core.kicad.source({ fileId, revisionId }),
  scene: async (data) => {

    const board = await core.kicad.render(data);

    return {
      version: 1,
      adapter: {
        name: pcb.name,
        version: pcb.version,
      },
      units: {
        length: 'mm',
      },
      entities: board.footprints.map((footprint) => ({
        id: `fp:${footprint.uuid}`,
        kind: 'footprint',
        label: footprint.reference,
        parentId: `layer:${footprint.layer}`,
        // a 2d placement is a 4 x 4 with z = 0: translation in elements 12 and 13, rotation about z
        transform: placement(footprint.x, footprint.y, footprint.rotation),
        bounds: footprint.bounds,
        geometryHash: footprint.padHash,
        signature: {
          pads: footprint.pads.length,
          extents: footprint.extents,
        },
        attributes: {
          value: footprint.value,
          footprint: footprint.library,
          pads: footprint.pads.length,
        },
        payloadRef: {
          svg: footprint.svgId,
        },
      })),
    };
  },
};
```

Then add it to `ordered` in `core/diff/adapter.ts`. The engine, the route, the cache, the websocket events and the tests' shape
come for free: a footprint swapped from 0603 to 0805 is **modified** (`footprint` changed, `geometryHash` changed), R12 rotated
90° is **moved** (`move.rotation` 90), a renumbered reference with the same UUID keeps its id, and a footprint deleted and placed
again (new UUID) still matches by pads and position (`match.method: 'signature'`).

**3. Viewer.** The 2D viewer loads both SVGs and the manifest (`loadDiff`), then for every manifest entity calls
`unifiedAppearance(entity, state)` (or `sideBySideAppearance`) and styles the elements `payloadRefA.svg` / `payloadRefB.svg`
with the returned colour and opacity (`a === null` hides A's element). It reuses the toolbar's filters, counts, slider and
entity panel from `FileDiffView` as they are, and adds layer toggles.

**4. Fixtures and tests.** A committed pair of small boards generated by a script, with one change of each class; the backend
unit test runs `compare` on their committed `scene.json` files (like `core/diff/__tests__/compare.test.ts`), the route test
uploads both revisions and checks the classes (like `api/routes/sync/__tests__/diffFile.test.ts`), and a Playwright spec opens
the compare view (like `tests/e2e/specs/diff.spec.ts`).

## Not done yet

* Workstreams B to E (the adapters and viewers above).
* CAD: instancing for repeated parts and a simplified fallback for huge models (only "changes only" above 4 M triangles today);
  per-solid deltas inside a part; Draco-compressed glbs.
* The unified view in the desktop app's FileCompare pages is the same code but is only exercised by the website e2e test.
