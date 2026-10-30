import { Color, DoubleSide, type Material, MeshStandardMaterial, type Object3D, SRGBColorSpace } from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { LABEL_KEY, NODE_FLAG, PART_FLAG, paletteColour } from './PreviewCadOss.utils'

/**
 * Prepares a loaded glTF for the viewer:
 * - every glTF node is flagged (NODE_FLAG) and keeps its glTF name as its label (three makes object names unique and
 *   strips some characters); the converter's `extras.stemn` is on `userData.stemn` already (GLTFLoader)
 * - nodes with geometry are parts (PART_FLAG): a mesh node, or the group of a node whose mesh has several primitives
 * - every mesh gets its own material (glTF materials are shared between primitives), so a later layer can colour or
 *   fade any node without touching the others; parts without a material get the converter's palette
 */
export const prepareModel = (gltf: GLTF) => {
  const { associations, json } = gltf.parser as any
  const meshDefinitions: any[] = json.meshes || []
  const nodeDefinitions: any[] = json.nodes || []

  const nodeIndex = (object: Object3D) => associations.get(object)?.nodes
  const isNode = (object: Object3D) => nodeIndex(object) !== undefined
  let partIndex = 0
  gltf.scene.traverse((object: any) => {
    if (!isNode(object)) return
    object.userData[NODE_FLAG] = true
    object.userData[LABEL_KEY] = nodeDefinitions[nodeIndex(object)]?.name || object.name
    const meshes = object.isMesh ? [object] : object.children.filter((child) => child.isMesh && !isNode(child))
    if (!meshes.length) return
    object.userData[PART_FLAG] = true
    const [r, g, b] = paletteColour(partIndex++)
    meshes.forEach((mesh) => {
      const association = associations.get(mesh) || {}
      const primitive = meshDefinitions[association.meshes]?.primitives?.[association.primitives ?? 0]
      const material: Material =
        primitive && primitive.material !== undefined
          ? mesh.material.clone()
          : new MeshStandardMaterial({
              color: new Color().setRGB(r, g, b, SRGBColorSpace),
              metalness: 0.05,
              roughness: 0.65,
            })
      material.side = DoubleSide
      mesh.material = material
      mesh.userData.opacity = material.opacity
    })
  })
  return gltf.scene
}

/** Parses a glb (or glTF JSON) and prepares it */
export const parseModel = async (data: ArrayBuffer | string) =>
  prepareModel(await new GLTFLoader().parseAsync(data, ''))
