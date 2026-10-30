# Plan: diff viewers for every open-source file type

Status: approved direction (founder, 2026-10-30). Workstream A (diff core + 3D CAD) is built: the contract for B to E is
[`../DIFF-VIEWERS.md`](../DIFF-VIEWERS.md). Planner: Claude Fable 5.1. Implementers: Opus 5.5
agents, one workstream each, following this document. Backend changes must follow the backend's
hand-written code style.

## Product requirement

The diff viewer is the core of Stemn's utility: a user must be able to tell what changed between
two revisions of a file. Side-by-side comparison exists today (`stemn-frontend-shared/src/misc/FileCompare`).
Every file type we render from an open-source format must also get a **unified diff view** with:

- a filter that highlights **added** entities;
- a filter that shows **removed** entities semi-transparent in place ("ghosted");
- a treatment for entities that **changed from A to B** (below);
- the existing side-by-side view kept as an option, with synchronised cameras/viewports;
- an entity list with counts per class (added / removed / modified / moved / unchanged) that focuses
  the viewport on click.

Proprietary native formats (SolidWorks, Inventor, CATIA, NX, Creo, Revit, Altium…) cannot be diffed
this way because they can only be rendered through closed converters; they keep the Autodesk path
and side-by-side only, and the UI says so.

## One change model for every type

Every renderer adapts its file into the same canonical **scene model** so one diff engine and one
UI serve all types:

```
entity { id, kind, label, parentId?, transform?, bounds, geometryHash, attributes{} , payloadRef }
```

- `id` is a **stable identifier** from the format when one exists: STEP product/instance names and
  the OCCT shape path, KiCad footprint/net/sheet UUIDs and reference designators, IFC GlobalIds,
  3MF object ids and mesh names, DXF entity handles, G-code layer index + segment index, VTK cell ids.
- When the format has no stable id (plain meshes, Gerber apertures), the adapter derives a
  **geometric signature** (vertex and face counts, bounding box, volume, centroid, a quantised
  shape hash) and the matcher pairs entities by signature similarity (Hungarian assignment on a
  distance over signature + position), so a part that was re-exported unchanged still matches.
- `geometryHash` lets the engine tell "modified" from "unchanged" and "moved" (same hash, different
  transform) cheaply.

The diff engine classifies each entity of A and B as **unchanged, added, removed, modified, moved**
and returns a manifest: counts, per-entity class, and for modified entities the attribute deltas.

## Unified view rendering rules

- **Added**: rendered solid in the "added" accent (green family), outline on hover.
- **Removed**: rendered at ~30% opacity in the "removed" accent (red family), in its A position,
  non-occluding (depth-tested but drawn after opaque geometry), click shows "removed in B".
- **Modified (same id, different geometry/attributes)**: B rendered solid in the "modified" accent
  (amber), A rendered ghosted at ~25% opacity in the same place so the shape change reads as an
  overlay; a per-entity **A/B swap** control and a global **slider** that crossfades A→B opacity.
  The entity panel lists the attribute deltas (dimensions, material, properties, net, layer…).
- **Moved**: B solid, A ghosted, plus a thin displacement line between centroids; the slider
  interpolates the transform so the move animates.
- **Unchanged**: neutral grey, optionally hidden ("changes only" filter).
- Filters are toggles: Added / Removed / Modified / Moved / Unchanged, defaulting to all but
  Unchanged on; counts shown on each toggle. 2D viewers (PCB layers, schematics, DXF) use the same
  classes and colours with layer toggles; raster-only diffs (Gerber) use a tri-colour overlay
  (A-only, B-only, both) per layer plus the same filters.

## Where the diff is computed

- **Server-side, cached.** The converter services (`services/cad-converter` and the new ones
  below) emit the scene model next to the render (glTF/SVG/VTK) for each revision; a diff request
  `GET /api/v1/sync/diff/{projectId}/{fileId}/{revisionA}/{revisionB}` computes or serves a cached
  diff manifest stored through the storage provider (object storage), keyed by the two revision
  ids and the adapter version. The client downloads A, B and the manifest and renders.
- Diff of text-based inputs (G-code, DXF ASCII, simulation decks, KiCad files as text) also keeps
  the existing code diff as a secondary tab.

## Per-type adapters and renderers

| Type | Formats | Convert with (open source) | Render with | Stable ids / matching | Workstream |
|---|---|---|---|---|---|
| 3D MCAD | STEP, IGES, BREP, STL, OBJ, glTF | OpenCascade (`services/cad-converter`, in progress) → glTF with node names and OCCT shape paths preserved | three.js glTF viewer (`PreviewCadOss`) | STEP product structure + shape hash; signature matching for meshes | A |
| PCB and electronics | Gerber RS-274X + Excellon, KiCad `.kicad_pcb`/`.kicad_sch`, Eagle `.brd`/`.sch` (XML); IPC-2581 later | KiCad CLI container (`kicad-cli pcb export svg/step/glb`, `sch export svg`), tracespace/`gerber-to-svg` for Gerber; the existing broken Gerber viewer is replaced | 2D layered SVG viewer with layer toggles; 3D board via the glTF viewer | reference designators, net names, footprint UUIDs; Gerber: per-layer raster XOR + vector signature matching for apertures/traces | B |
| Civil and architecture | IFC 2x3/4, DXF (DWG via LibreDWG where it parses) | IfcOpenShell → glTF with GlobalId per node and property sets; ezdxf → SVG with entity handles | glTF viewer with IFC property panel; 2D SVG viewer | GlobalId; DXF handles; geometric fallback | C |
| Additive manufacturing | 3MF, STL (via A), G-code | lib3mf → glTF with object ids; G-code parser → per-layer toolpath segments (JSON) | glTF viewer; G-code layer viewer (three.js lines) with layer slider | 3MF object ids + mesh hash; G-code layer index + segment signature (added/removed/changed paths per layer) | D |
| Simulation results | VTK/VTU/VTP, OpenFOAM cases (via `foamToVTK`), Nastran/Abaqus input decks stay in the text diff | VTK-based converter container emitting VTK.js-readable data (vtkJSON/vtp) | VTK.js renderer (lazy) with field selector | cell/point ids; mesh add/remove; **field delta mode**: colour map of B − A on matched cells, with range controls | E |

## Performance rules (hard)

- Every renderer and its diff module is a **separate lazy chunk** (`import()` in the preview
  registry); the initial website bundle must not grow (CI asserts the main chunks' gzip size
  against the current baseline with a 2% tolerance). three.js, VTK.js, the SVG viewers and the
  glTF loaders load only when a file of that type is opened; shared three.js between A, C and D is
  one chunk.
- Converters run server-side with size and time limits; diff manifests are cached; the client
  never parses STEP/IFC/VTK itself.
- Large scenes: instancing for repeated parts, frustum culling, and a cap with a "simplified"
  fallback above N million triangles, surfaced in the UI rather than freezing it.
- The same lazy loading applies in the Electron and Tauri renderers (they share the code).

## Workstreams and order

1. **A — diff core + 3D CAD** (first, defines the contracts): the scene-model types in
   `@stemn/types`, the diff engine (TypeScript, unit-tested with synthetic scenes), the unified
   view UI and entity panel in `FileCompare`, camera-synced side-by-side, the backend diff route
   and cache, the OCCT adapter emitting scene models and stable ids, e2e tests on the committed
   STEP fixtures (bracket v1 → v2 with a hole added, a part removed, a part moved, a fillet changed).
2. **B, C, D, E in parallel** once A's contracts are merged: each adds its converter container (or
   extends the existing one), the adapter, the lazy renderer, fixtures in both revisions (committed,
   generated deterministically by scripts), unit tests for matching, and e2e tests for the unified
   view classes, all behind the same UI.
3. Each workstream is one PR per repo (backend first, then frontend), green CI, backend style rules.

## Fixtures

Every type gets a committed pair (A, B) of small files generated by a script in the converter
image, exercising all five classes at once: something added, something removed, something modified,
something moved, the rest unchanged. The same fixtures feed the converter unit tests, the diff
engine tests and the e2e tests, so the full path is verified from file bytes to pixels.

## Open questions for the founder

- Colour accents for added/removed/modified: proposed green/red/amber, respecting the app's theme.
- Whether "moved" should animate by default or only on hover.
- Which simulation result formats matter most to the first customers (VTK/VTU first; others on request).
