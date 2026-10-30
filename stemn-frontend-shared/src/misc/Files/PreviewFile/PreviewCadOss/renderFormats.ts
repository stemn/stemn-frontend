/**
 * What the open-source converter (stemn-backend services/cad-converter) makes of a file, by its extension, and where its
 * outputs are. No three.js here: the preview registry and FileCompare (main bundle) pick the lazy viewer with these.
 */

/** One output of an open-source render by name: 'model.glb', 'drawing.svg' (2D drawings), 'scene.json', 'thumbnail.png' */
export const renderFileUrl = (
  { projectId, fileId, revisionId }: { projectId: string; fileId: string; revisionId: string },
  output: string,
) => `${GLOBAL_ENV.API_SERVER}/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}/${output}`

/**
 * Files the open-source converter turns into a 2D drawing (an SVG) rather than a glb: DXF, and DWG through LibreDWG.
 * Their renders are shown by the 2D viewer, and their diffs by the 2D diff viewer.
 */
export const drawingExtensions = ['dxf', 'dwg']

/** IFC models (IfcOpenShell): the glTF viewer with the IFC property panel */
export const ifcExtensions = ['ifc']

const extensionOf = (name?: string) => (name && name.includes('.') ? name.split('.').pop()!.toLowerCase() : '')

export const isDrawingFile = (file?: { name?: string } | null) => drawingExtensions.includes(extensionOf(file?.name))

export const isIfcFile = (file?: { name?: string } | null) => ifcExtensions.includes(extensionOf(file?.name))
