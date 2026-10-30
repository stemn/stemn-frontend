/**
 * three.js side of the diff viewer: applies the class appearances (diff.utils) to the glTF nodes of revisions A and B,
 * moves B along the A -> B slider, and draws displacement lines and hover outlines. Lazy chunk only.
 */
import {
  Box3,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  Quaternion,
  Vector3,
} from 'three'
import type { IDiffEntity } from '../diff.types'
import type { IDiffAppearance } from '../diff.utils'

export interface IDiffModel {
  root: Object3D
  nodesById: Map<string, Object3D>
}

export type IDiffSide = 'a' | 'b'

const meshesOf = (node: Object3D) => {
  const meshes: Mesh[] = []
  node.traverse((object) => {
    if ((object as Mesh).isMesh) meshes.push(object as Mesh)
  })
  return meshes
}

/** The node that draws an entity in revision A or B */
export const entityNode = (model: IDiffModel | null, entity: IDiffEntity, side: IDiffSide) => {
  const id = side === 'a' ? entity.idA : entity.idB
  return (model && id && model.nodesById.get(id)) || null
}

/**
 * Remembers each node's world placement as loaded (`userData.diffWorld`), so the slider can interpolate between A's and
 * B's placements and put B back afterwards. Call once per model, after it has loaded.
 */
export const rememberPlacements = (model: IDiffModel) => {
  model.root.updateMatrixWorld(true)
  model.nodesById.forEach((node) => {
    if (!node.userData.diffWorld) node.userData.diffWorld = node.matrixWorld.clone()
  })
}

/** Draws a node (its meshes) with an appearance, or hides it (null) */
export const applyAppearance = (node: Object3D | null, appearance: IDiffAppearance | null) => {
  if (!node) return
  node.visible = Boolean(appearance)
  if (!appearance) return
  meshesOf(node).forEach((mesh) => {
    const material = mesh.material as MeshStandardMaterial
    material.color.set(appearance.colour)
    material.opacity = appearance.opacity
    material.transparent = appearance.transparent
    // ghosts are depth-tested against the solid geometry, but never hide what is behind them
    material.depthWrite = !appearance.transparent
    material.needsUpdate = true
    mesh.renderOrder = appearance.renderOrder
  })
}

/** The placement t of the way from `from` to `to` (positions and scales interpolated, rotations slerped) */
export const interpolatePlacement = (from: Matrix4, to: Matrix4, t: number) => {
  const [positionA, rotationA, scaleA] = [new Vector3(), new Quaternion(), new Vector3()]
  const [positionB, rotationB, scaleB] = [new Vector3(), new Quaternion(), new Vector3()]
  from.decompose(positionA, rotationA, scaleA)
  to.decompose(positionB, rotationB, scaleB)
  return new Matrix4().compose(positionA.lerp(positionB, t), rotationA.slerp(rotationB, t), scaleA.lerp(scaleB, t))
}

/** Puts a node at a world placement, whatever its parent's placement */
export const placeAt = (node: Object3D, world: Matrix4) => {
  const parentWorld = node.parent ? node.parent.matrixWorld : new Matrix4()
  const local = parentWorld.clone().invert().multiply(world)
  local.decompose(node.position, node.quaternion, node.scale)
  node.updateMatrixWorld(true)
}

/** Moves B's node of a moved entity t of the way from A's placement to its own (1 puts it back) */
export const placeAlongMove = (nodeA: Object3D | null, nodeB: Object3D | null, t: number) => {
  if (!nodeB || !nodeB.userData.diffWorld) return
  const target = nodeB.userData.diffWorld as Matrix4
  const start = nodeA && nodeA.userData.diffWorld ? (nodeA.userData.diffWorld as Matrix4) : target
  placeAt(nodeB, t >= 1 ? target : interpolatePlacement(start, target, t))
}

/** A thin line between the A and B centres of a moved entity, drawn over the model */
export const displacementLine = (entity: IDiffEntity, colour: string) => {
  if (!entity.centreA || !entity.centreB) return null
  const geometry = new BufferGeometry().setFromPoints([
    new Vector3().fromArray(entity.centreA),
    new Vector3().fromArray(entity.centreB),
  ])
  const line = new Line(geometry, new LineBasicMaterial({ color: new Color(colour), depthTest: false }))
  line.renderOrder = 3
  line.userData.diffLine = entity.id
  return line
}

/** The edges of a node's meshes, as a child of each mesh so they follow it: the hover and selection outline */
export const setOutline = (node: Object3D | null, colour: string | null) => {
  if (!node) return
  meshesOf(node).forEach((mesh) => {
    let outline = mesh.userData.diffOutline as LineSegments | undefined
    if (!outline && colour) {
      outline = new LineSegments(
        new EdgesGeometry(mesh.geometry, 30),
        new LineBasicMaterial({ color: new Color(colour), depthTest: false, transparent: true, opacity: 0.9 }),
      )
      outline.renderOrder = 4
      outline.raycast = () => {}
      mesh.userData.diffOutline = outline
      mesh.add(outline)
    }
    if (outline) {
      outline.visible = Boolean(colour)
      if (colour) (outline.material as LineBasicMaterial).color.set(colour)
    }
  })
}

/** The bounds of the visible nodes, for fitting the camera */
export const visibleBounds = (nodes: Array<Object3D | null>) => {
  const box = new Box3()
  nodes.forEach((node) => {
    if (node && node.visible) box.expandByObject(node)
  })
  return box
}

/** Every node of a model by object, the reverse of nodesById, for picking */
export const idsByNode = (model: IDiffModel | null) => {
  const ids = new Map<Object3D, string>()
  if (model) model.nodesById.forEach((node, id) => ids.set(node, id))
  return ids
}

/** The entity id and revision of the glTF node a picked object belongs to: the nearest node up its parents */
export const pickedEntity = (
  object: Object3D | null,
  sides: Array<{ side: IDiffSide; ids: Map<Object3D, string> }>,
) => {
  let node: Object3D | null = object
  while (node) {
    for (const { side, ids } of sides) {
      const id = ids.get(node)
      if (id) return { id, side }
    }
    node = node.parent
  }
  return null
}

/** A group that owns the displacement lines of a scene, so they can be replaced in one go */
export const lineGroup = () => {
  const group = new Group()
  group.name = 'diff-lines'
  return group
}

export const disposeLines = (group: Group) => {
  group.children.forEach((child) => {
    const line = child as Line
    line.geometry.dispose()
    ;(line.material as LineBasicMaterial).dispose()
  })
  group.clear()
}
