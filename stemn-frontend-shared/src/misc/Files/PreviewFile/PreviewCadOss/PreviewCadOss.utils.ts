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

/** The flag the viewer sets on objects that are glTF nodes with geometry (one entry in the part list each) */
export const PART_FLAG = 'stemnPart'

export interface ICadPart {
  /** Object3D uuid */
  id: string
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
 * The parts of a model: every object flagged as a glTF node with geometry, in scene order, named by the
 * node (the converter names nodes after the CAD product, or after the file for single parts).
 */
export const partsFromScene = (scene: Object3D): ICadPart[] => {
  const parts: ICadPart[] = []
  scene.traverse((object) => {
    if (object.userData[PART_FLAG]) {
      parts.push({
        id: object.uuid,
        name: object.name || `Part ${parts.length + 1}`,
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
