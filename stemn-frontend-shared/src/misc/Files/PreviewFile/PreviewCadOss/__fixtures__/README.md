# Converter glb fixtures

Outputs of stemn-backend's CAD converter (`services/cad-converter`), copied here for the viewer's unit tests:

* `assembly.glb`: `assembly.step` (base plate and bracket), with the stable node ids in `extras.stemn`
* `bracket-assembly-v1.glb`: a five part bracket assembly (base plate, bracket, pin, spacer, nut), the first revision
  of the file-diff fixtures
* `assembly-without-ids.glb`: `assembly.step` converted before the converter wrote ids, for the name-path fallback
