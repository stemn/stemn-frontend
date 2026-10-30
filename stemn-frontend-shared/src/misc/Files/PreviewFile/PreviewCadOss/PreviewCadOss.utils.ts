import { Box3, type Object3D, Plane, Sphere, Vector3 } from 'three'

/** CAD conversion providers (the render record's `cadProvider`; absent on renders made before it existed) */
export type ICadProvider = 'autodesk' | 'opencascade'

export const cadProviderNames: Record<ICadProvider, string> = {
  autodesk: 'Autodesk',
  opencascade: 'OpenCascade',
}

/** Renders without a cadProvider are Autodesk renders (the only provider before the open-source converter) */
export const isOpenCascadeRender = (render?: { cadProvider?: string }) =>
  Boolean(render && render.cadProvider === 'opencascade')

/**
 * Colours for parts without a material, in part order. The converter's thumbnails use the same palette
 * (stemn-backend services/cad-converter/converter/scene.py), so a part has the same colour in both.
 */
export const partPalette: Array<[number, number, number]> = [
  [0.72, 0.74, 0.78],
  [0.42, 0.58, 0.78],
  [0.85, 0.55, 0.3],
  [0.45, 0.7, 0.5],
  [0.75, 0.5, 0.7],
  [0.8, 0.75, 0.4],
]

export const paletteColour = (index: number) => partPalette[index % partPalette.length]

/** The glb of an open-source render (the API's render download route answers with the model for these renders) */
export const renderModelUrl = ({
  projectId,
  fileId,
  revisionId,
}: {
  projectId: string
  fileId: string
  revisionId: string
}) => `${GLOBAL_ENV.API_SERVER}/api/v1/sync/downloadRender/${projectId}/${fileId}/${revisionId}`

/** The flag the viewer sets on every object that is a glTF node */
export const NODE_FLAG = 'stemnNode'
/** The flag the viewer sets on glTF nodes with geometry (one entry in the part list each) */
export const PART_FLAG = 'stemnPart'
/** Where the viewer keeps a node's original glTF name (three makes object names unique and strips some characters) */
export const LABEL_KEY = 'stemnLabel'

const isNode = (object: Object3D) =>
  Boolean(object.userData[NODE_FLAG] || (object.userData.stemn && object.userData.stemn.id))

/** A node's display label: its glTF name (the converter's product or instance name) */
export const nodeLabel = (object: Object3D) => object.userData[LABEL_KEY] || object.name || ''

/**
 * Every glTF node of a model by its stable id: the converter's `extras.stemn.id`, or for glbs without it (older
 * renders) the path of node labels from the top, with `#n` on the n-th sibling of the same label, the converter's
 * own scheme ('bracket-assembly/bolt', 'bracket-assembly/bolt#2'). This map is the seam a file-diff layer uses to
 * colour or ghost entities by id; every mesh has its own material, so overriding one never touches another.
 */
export const nodesFromScene = (root: Object3D): Map<string, Object3D> => {
  const nodesById = new Map<string, Object3D>()
  const visit = (object: Object3D, parentPath: string) => {
    const seen = new Map<string, number>()
    for (const child of object.children) {
      if (!isNode(child)) {
        visit(child, parentPath)
        continue
      }
      const label = nodeLabel(child) || 'node'
      const occurrence = (seen.get(label) || 0) + 1
      seen.set(label, occurrence)
      const fallback = `${parentPath ? `${parentPath}/` : ''}${label}${occurrence > 1 ? `#${occurrence}` : ''}`
      const extras = child.userData.stemn
      const id: string = extras && extras.id ? extras.id : fallback
      nodesById.set(id, child)
      visit(child, id)
    }
  }
  visit(root, '')
  return nodesById
}

export interface ICadPart {
  /** The node's stable id (see nodesFromScene) */
  id: string
  /** Display label */
  name: string
  triangles: number
}

const countTriangles = (object: Object3D) => {
  let triangles = 0
  object.traverse((child: any) => {
    if (child.isMesh && child.geometry) {
      const { index, attributes } = child.geometry
      const count = index ? index.count : attributes.position ? attributes.position.count : 0
      triangles += Math.floor(count / 3)
    }
  })
  return triangles
}

/**
 * The parts of a model: every node with geometry, in scene order, keyed by its id and named by its label (the
 * converter names nodes after the CAD product or instance, or after the file for single parts).
 */
export const partsFromScene = (scene: Object3D, nodesById = nodesFromScene(scene)): ICadPart[] => {
  const ids = new Map<Object3D, string>()
  nodesById.forEach((object, id) => ids.set(object, id))
  const parts: ICadPart[] = []
  scene.traverse((object) => {
    if (object.userData[PART_FLAG]) {
      parts.push({
        id: ids.get(object) || object.uuid,
        name: nodeLabel(object) || `Part ${parts.length + 1}`,
        triangles: countTriangles(object),
      })
    }
  })
  return parts
}

/** Isometric view direction (front right, above), the same as the converter's thumbnails */
export const viewDirection = new Vector3(1, 0.8, 1.2).normalize()

/**
 * Camera placement that fits a bounding box in a perspective view: the bounding sphere fills the
 * smaller of the vertical and horizontal fields of view, with a margin.
 */
export const fitCamera = (box: Box3, fov: number, aspect: number, margin = 1.05) => {
  const sphere = box.getBoundingSphere(new Sphere())
  const radius = Math.max(sphere.radius, 1e-6)
  const vertical = (fov * Math.PI) / 180
  const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * aspect)
  const distance = (radius / Math.sin(Math.min(vertical, horizontal) / 2)) * margin
  return {
    target: sphere.center.clone(),
    position: sphere.center.clone().addScaledVector(viewDirection, distance),
    near: Math.max(distance - radius * 2, distance / 1000),
    far: distance + radius * 4,
    radius,
  }
}

export type ISectionAxis = 'x' | 'y' | 'z'

/**
 * The section (clipping) plane: cuts the model across the given axis at `fraction` (0-1) of its extent and
 * keeps the part below the cut.
 */
export const sectionPlane = (box: Box3, axis: ISectionAxis, fraction: number, plane = new Plane()) => {
  const normal = new Vector3(axis === 'x' ? -1 : 0, axis === 'y' ? -1 : 0, axis === 'z' ? -1 : 0)
  const min = box.min[axis]
  const max = box.max[axis]
  const position = min + (max - min) * Math.min(Math.max(fraction, 0), 1)
  return plane.set(normal, position)
}
