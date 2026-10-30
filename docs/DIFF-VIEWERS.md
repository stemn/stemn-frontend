# Diff viewers: the contract

How Stemn shows what changed between two revisions of a file, and what a new file type has to provide to get the same
viewer. The product plan is [`plans/file-diff-viewers.md`](plans/file-diff-viewers.md); this document is the contract that
workstream A (diff core + 3D CAD) delivered and that workstreams B to E (PCB, AEC, additive, simulation) build on; PCB (B), AEC (C)
and additive (D) are built (below).

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

`FileCompare`: for CAD files (`getViewerType` `autodesk`, which includes IFC, DXF and DWG) the compare menu offers **Compare:
Unified Diff**, and with two revisions selected both the unified and the side-by-side modes open the diff viewer
(`FileCompareInner`): `FileDiffView` for models (3MF included), `DxfDiffView` for drawings (`isDrawingFile`). G-code
(`getViewerType` `gcode`) opens in `GcodeDiffView` the same way (`isGcodeFile`). Files the API cannot
diff fall back to the original side-by-side previews with a notice. In the commit and changes views (`FileCompare` with two revisions), CAD files open in the unified mode.
Simulation results (`getViewerType` `simulation`) do the same in `FileDiff/SimulationDiffView` (vtk.js, its own lazy chunk).
Opened alone, they preview in `PreviewSimulation`, which `PreviewCadSwitch` picks for renders whose `cadProvider` is `vtk`.

PCB and electronics files (`getViewerType` `pcb`: KiCad `.kicad_pcb`/`.kicad_sch`, Eagle `.brd`, Gerber layers, Excellon drill
files, zips of a Gerber set) get the same menu entry and open in `PcbDiffView` (the 2D viewer, `Svg2dDiffView`, on the PCB
converter's drawings), unified in the commit and changes views too. Their previews (`PreviewPcb`) draw the same SVGs on the same
canvas, with layer toggles.

**PCB drawings and entities** (stemn-backend `services/pcb-converter/README.md`): the SVG is in millimetres, y down, with a
`<rect data-background>`, one `<g data-layer>` per layer back to front (KiCad's names: `F.Cu`, `B.Silkscreen`, `In1.Cu`,
`Edge.Cuts`, `Drill`; mask, paste, fab and courtyard `data-layer-default="hidden"`), and an entity drawn on several layers has a
`<g data-entity-id>` in each. Boards: footprints `fp:<uuid>` (Eagle `fp:<reference>`), `net:<name>` for each net's tracks and vias,
`zone:<uuid>`, `gr:<uuid>`; schematics: `sym:`, `wire:`, `bus:`, `junction:`, `label:`, `text:`, `sheet:` by uuid; Gerbers:
`<layer>/cmp:<reference>` (X2 attributes), `<layer>/net:<name>`, and shapes by digest; drill files `Drill/hole:<x>,<y>`.
`payloadRef` is `{ svg, at: [x, y, angle] }`, so a turned footprint turns back along the slider. Lengths are millimetres
(`units.length: 'mm'`).

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

## Civil and architecture (workstream C)

**IFC** (`aec` adapter, ADR-011 here, ADR-025 in stemn-backend):
* The converter (IfcOpenShell) writes a glb with a node per product with a body. The entity id is the GlobalId; the parent is
  the spatial element it is in (a storey or space).
* `extras.stemn.ifc` holds the class, name, type, material, storey, the class's attributes, `psets` and `quantities`.
* The diff compares those attributes and every property (`Pset_WallCommon.FireRating`). Volume, area, size and triangles are
  `derived`. Units are as for CAD.
* `FileDiffView` adds the lazy IFC property panel (`FileDiff/IfcPanel`) and a storey filter for `adapter.name === 'aec'`.

**DXF and DWG** (`dxf` adapter): the converter (ezdxf; DWG through LibreDWG) writes `drawing.svg` instead of `model.glb`.
* One entity per modelspace entity: id the handle, kind the DXF type, parent `layer:<name>`, `payloadRef` `{ svg: handle }`.
* `units.length` is the drawing's unit (`mm` for most); `formatLength` prints `m` and `mm` as millimetres, any other unit as
  it is, and `unit` (unitless) as a bare number.
* The viewer is the shared 2D viewer below.

### The shared 2D viewer (`FileDiff/Svg2dDiffView`, used by DXF and PCB)

A 2D file type needs only a wrapper that says where a revision's SVG is (`DxfDiffView`, about 15 lines). The SVG must look like
this:

```txt
<svg viewBox="..." data-units="mm">                    one coordinate frame for A and B
  <rect data-background="true" fill="#001023"/>        optional: the canvas colour, drawn once, never styled
  <g data-diff-frame="true" ...>                       the frame the manifest's centreA/centreB are in (else the <svg>)
    <g data-layer="F.Cu" data-layer-name="Front copper" [data-off="true" | data-layer-default="hidden"]>   back to front
      <g data-entity-id="<payloadRef.svg>" [data-paint="fill|stroke|both"]> shapes </g>   one or more per entity
```

* **Entities:** an entity is every element with `data-entity-id` equal to its `payloadRef.svg`. It may span several layers
  (a footprint's pads and silkscreen).
* **Appearances** follow `unifiedAppearance` / `sideBySideAppearance` like the 3D viewer:
  - The class colour goes on every painted fill and stroke inside the entity. `data-paint` says which when the paint is on a group.
  - The colour also goes on `color`, for `currentColor`.
  - Opacity goes on the entity element, so overlapping shapes do not add up. `null` hides the entity.
* **The slider:** B's copy of a moved entity is translated by `centreA - centreB` times `1 - t`. When both `payloadRef`s have
  `at: [x, y, degrees]` (SVG `rotate()` sense, the element's parent's units), it also turns about the placement origin.
* **The rest of the view:** the displacement line is drawn in `data-diff-frame`; layer toggles act on both revisions; side by
  side shares one view box.
* **Previews:** `SvgDiffCanvas` without a manifest draws a plain preview (`PreviewDrawing`).
* **Safety:** SVGs are sanitised on parse.

## Additive manufacturing (workstream D, built)

stemn-backend ADR-026 and stemn-frontend ADR-012. Both formats convert in `services/cad-converter`.

* **3MF** (`additive` adapter): one entity per build item (`kind: 'object'`), id the object's name (`foot#1`, `foot#2` when one
  object is placed twice), the item's transform in its glTF node, `geometryHash` an exact hash of the object's triangles in its
  own frame, `attributes` `material`, `colour`, `type`, `partNumber`, `components` and the derived `objectId`, `triangles`,
  `volume`, `area`, `size`. The glTF diff viewer draws it unchanged; the entity details read the material and colour from the
  node's `extras.stemn`.
* **G-code** (`gcode` adapter): one entity per layer (`kind: 'layer'`), id its height above the first layer (`layer:z+1.200`, so
  an inserted or removed layer renames no other), `transform` a translation to the lowest corner of its extrusions at its z,
  `bounds` in millimetres in the printer's frame (`units.length: 'mm'`), no signature (matched by id only), `payloadRef:
  { layer }` (the index in `toolpath.bin`). `FileDiff/GcodeDiffView` (its own lazy chunk, from `FileCompareInner` for G-code)
  loads both toolpaths with `useDiffLoad`, keeps the shared toolbar, state and entity panel, and draws with
  `PreviewGcode/ToolpathDiff`, which calls `unifiedAppearance` per layer and
  styles that layer's line set, moves B's layer by `-(1 - placement) × move.translation`, and for a selected modified layer
  compares A's and B's moves (`compareLayers`, 10 µm) and draws the ones only A has in the removed colour and only B has in the
  added colour.
* Fixtures: stemn-backend `core/__tests__/samples/additive` (copied to `tests/e2e/fixtures/additive`), with `samples.json`.

### What the other workstreams should know

* `IDiffEntity` carries the deltas, not the entity's own attributes: a viewer that wants to show unchanged properties (a 3MF
  material, IFC property sets) reads them from its render (here the glTF node's `extras.stemn`), or the contract grows an
  `attributes` field.
* The engine pairs entities with different ids by shape and position; identical shapes at another position become **moved**.
  For ordered, stacked entities (layers, sheets, storeys) set `signature: null` and put the position in the `geometryHash` or
  the id, or a removed and an added entity of the same shape read as one moved entity.
* Attributes whose only change follows a placement (`z`, `height`) must be in `derived`, or every moved entity reads as modified.
* `formatValue` shows objects of numbers as `name value, ...`; units other than `mm`, `mm2` and `mm3` (`s`, `mm/s`) print as
  given. The panel sorts labels in number order.
* The 3MF material shows through `DiffEntityPanel`'s `details` prop; a viewer's own per-entity details go there.

## Optional extension: field deltas (simulation results, workstream E)

Adapters whose entities carry **fields** (values per point or per cell, such as pressure or velocity) can compare those values
between A and B. The contract above is unchanged by this extension. Every part of it is optional, and the simulation adapter is
the only one that uses it today (stemn-backend ADR-027).

* **Adapter**: `IDiffAdapter.annotate?({ fileId, revisionA, revisionB, a, b, entities })` returns `{ entities, fields? }`.
  `core.diff.create` calls it after `compare`. It may add `changes` to the compared entities and a `fields` section to the
  manifest; it does not change classes.
* **Changes**: a field becomes the change `{ attribute: 'field:<name>', a: [min, max] | null, b: [min, max] | null, delta? }`.
  Ranges are by magnitude for vectors. `delta` is an `IDiffFieldDelta`:
  * `{ min, max, mean, rms, changed, count }` of B − A over the entity's points or cells, for scalars
  * the same of |B| − |A| for vectors, plus `components: [...]` with each component's B − A
  * present only when A and B have the same cells

  The scene's `units['field:<name>']` is `'range'`, so `formatValue` and `formatDelta` print `0 … 7` and `-0.25 … +0.5` in the
  shared deltas table. Field ranges are a *derived* attribute: new results alone never make an entity modified.
* **Manifest** (optional):

  ```ts
  fields?: {
    fields: Array<{ name; association: 'point' | 'cell'; components; a: number[] | null; b: number[] | null }>
    entities: {
      [id]: {
        topology: 'same' | 'different'
        deltas: Array<{ field; association; components; delta: IDiffFieldDelta; path }>
      }
    }
  }
  ```

  `topology: 'same'` means A and B have the same cells connected the same way. Only then are fields compared value by value,
  and a field missing from `deltas` did not change. `path` names B − A on B's surface:

  `GET /api/v1/sync/diffField/{projectId}/{fileId}/{revisionA}/{revisionB}/{path}`

  It returns float32 values, little endian, per point or cell of the surface: one value per scalar, or the components followed
  by |B| − |A| per vector.
* **Viewer**: Δ mode colours each entity whose topology is `'same'` by B − A. It uses a diverging map (blue less, red more) with
  an auto range symmetric about zero, a hand-set ± limit and invert. Every other entity keeps its class treatment
  (`unifiedAppearance`), and the panel says why: "meshed again, Δ is not drawn on it". A and B modes colour one revision's
  entities by the field's values on one range for A and B. The legend shows the range in use (`simulation-legend`).
* **Render files**: a simulation revision is a render with `cadProvider: 'vtk'`. Its files are read with
  `GET /sync/downloadRenderFile/{projectId}/{fileId}/{revisionId}/{path}`, with `path` plain or url-encoded as one segment
  (`blocks%2F0%2Findex.json`, what the viewer sends):
  * `scene.json`
  * `blocks/<b>/index.json` and `blocks/<b>/data/<array>`: each block's surface in the vtk.js serialisation
  * `thumbnail.png`

  `payloadRef` is `{ block, topology, fields, surface: { points, cells } }`.

Workstreams with per-entity values that are not geometry (G-code feed rates or temperatures per layer, IFC quantities) can use
the same section: `topology: 'same'` when the values line up one to one, a `path` per array the viewer colours by.

## Not done yet

* Simulation results: OpenFOAM cases, multi-file collections (`.pvd`, `.vtm`) and Exodus II (stemn-backend FUTURE-WORK).
* IFC and drawings: the limits in stemn-backend `docs/FUTURE-WORK.md` (spaces and openings, linetypes, fonts, layouts, xrefs,
  `<use>` for blocks, AutoCAD-written DWG).
* PCB: diffs of a folder's Gerber files shown as one board (they have no revisions of their own: diff a zip of the set, or each
  layer file); Eagle and KiCad 5 schematics; Altium, EasyEDA and other boards KiCad can import; the 3D board.
* CAD: instancing for repeated parts and a simplified fallback for huge models (only "changes only" above 4 M triangles today);
  per-solid deltas inside a part; Draco-compressed glbs.
* The unified view in the desktop app's FileCompare pages is the same code but is only exercised by the website e2e test.
