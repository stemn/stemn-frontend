# Additive manufacturing fixtures

Byte-identical copies of stemn-backend's additive samples (`services/api/src/core/__tests__/samples/additive`, generated
by that directory's `generate-samples.py`; `samples.json` there lists what changed). The converter tests, the API's diff
tests and these website e2e tests use the same files. Copy them again when the backend samples are regenerated; do not
edit them.

- `parts-v1.3mf` → `parts-v2.3mf`: a 3MF build plate, one entity per build item (lid added, pin removed, knob meshed
  finer, spacer moved 30 mm; base, the two feet and the two-component peg unchanged), with base materials and a colour
- `tube-v1.gcode` → `tube-v2.gcode`: a sliced square tube, one entity per layer (a layer added at 2.2 mm, the one at
  1.0 mm removed, solid infill added at 1.4 mm, the layer at 0.8 mm moved 1.5 mm in x, seven unchanged)

Both are for `specs/additive.spec.ts`.
