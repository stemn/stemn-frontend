/**
 * three.js side of the G-code viewer (lazy chunk): every layer of a toolpath is a group of two line sets, its extrusions
 * (coloured by feature, or by diff class) and its travel moves, in the printer's frame (millimetres, z up) under a root
 * turned to three's y up. The preview and the diff view both draw with these.
 */
import {
  Box3,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  type Object3D,
  Vector3,
} from 'three'
import type { IDiffAppearance } from '../../../FileDiff/diff.utils'
import { featureColours, type IToolpath, type IToolpathLayer, travelColour } from './toolpath'

export type IToolpathSide = 'a' | 'b'

export interface IToolpathLayerObjects {
  group: Group
  extrusion: LineSegments
  travel: LineSegments | null
}

export interface IToolpathModel {
  toolpath: IToolpath
  /** Turned so the printer's z is up; the layers' groups are its children, in the printer's frame */
  root: Group
  layers: IToolpathLayerObjects[]
}

/** How a layer is drawn: in its features' colours, with a diff appearance, or not at all */
export type ILayerLook = 'features' | IDiffAppearance | null

const featurePalette = (toolpath: IToolpath) => toolpath.features.map((feature) => new Color(featureColours[feature]))

/** The line set of some of a layer's moves (all extrusions, all travels, or the given indexes) */
export const layerLines = (
  toolpath: IToolpath,
  layer: IToolpathLayer,
  pick: (index: number, kind: number) => boolean,
  colours?: Color[],
) => {
  const positions: number[] = []
  const vertexColours: number[] = []
  const { points, kinds } = toolpath
  for (let index = 0; index < layer.count; index++) {
    const kind = kinds[layer.segment + index]
    if (!pick(index, kind)) continue
    const from = (layer.point + index) * 2
    positions.push(points[from], points[from + 1], layer.z, points[from + 2], points[from + 3], layer.z)
    if (colours) {
      const colour = colours[kind - 1] || colours[colours.length - 1]
      vertexColours.push(colour.r, colour.g, colour.b, colour.r, colour.g, colour.b)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  if (colours) geometry.setAttribute('color', new Float32BufferAttribute(vertexColours, 3))
  return geometry
}

/** Builds the line sets of every layer of a toolpath */
export const buildToolpathModel = (toolpath: IToolpath, side?: IToolpathSide): IToolpathModel => {
  const root = new Group()
  root.name = 'toolpath'
  root.rotation.x = -Math.PI / 2
  const palette = featurePalette(toolpath)
  const layers = toolpath.layers.map((layer, index) => {
    const group = new Group()
    group.name = layer.id
    group.userData.toolpathLayer = index
    group.userData.toolpathSide = side
    const extrusion = new LineSegments(
      layerLines(toolpath, layer, (_, kind) => kind > 0, palette),
      new LineBasicMaterial({ vertexColors: true }),
    )
    group.add(extrusion)
    const hasTravel = Array.from(toolpath.kinds.subarray(layer.segment, layer.segment + layer.count)).includes(0)
    const travel = hasTravel
      ? new LineSegments(
          layerLines(toolpath, layer, (_, kind) => kind === 0),
          new LineBasicMaterial({
            color: new Color(travelColour),
            transparent: true,
            opacity: 0.45,
            depthWrite: false,
          }),
        )
      : null
    if (travel) {
      travel.visible = false
      travel.raycast = () => {}
      group.add(travel)
    }
    root.add(group)
    return { group, extrusion, travel }
  })
  root.updateMatrixWorld(true)
  return { toolpath, root, layers }
}

/** Draws a layer's extrusions in its features' colours, with a diff appearance, or hides the layer (null) */
export const setLayerLook = (objects: IToolpathLayerObjects, look: ILayerLook) => {
  objects.group.visible = Boolean(look)
  if (!look) return
  const material = objects.extrusion.material as LineBasicMaterial
  if (look === 'features') {
    material.vertexColors = true
    material.color.set('#ffffff')
    material.opacity = 1
    material.transparent = false
    material.depthWrite = true
    objects.extrusion.renderOrder = 0
  } else {
    material.vertexColors = false
    material.color.set(look.colour)
    material.opacity = look.opacity
    material.transparent = look.transparent
    // ghosts are depth-tested against the solid layers, but never hide what is behind them
    material.depthWrite = !look.transparent
    objects.extrusion.renderOrder = look.renderOrder
  }
  material.needsUpdate = true
}

/** The bounds of some layers of a toolpath, in the printer's frame (null when they have no points) */
export const layersBox = (toolpath: IToolpath, layers: IToolpathLayer[]) => {
  const box = new Box3()
  const point = new Vector3()
  layers.forEach((layer) => {
    for (let index = 0; index <= layer.count; index++) {
      const at = (layer.point + index) * 2
      box.expandByPoint(point.set(toolpath.points[at], toolpath.points[at + 1], layer.z))
      box.expandByPoint(point.set(toolpath.points[at], toolpath.points[at + 1], layer.z - layer.height))
    }
  })
  return box.isEmpty() ? null : box
}

/** A box in the printer's frame, in the world (through the model's root) */
export const worldBox = (box: Box3, root: Object3D) => {
  root.updateMatrixWorld(true)
  return box.clone().applyMatrix4(root.matrixWorld)
}

/** The extrusions of a layer's given moves in one colour, drawn over the layers: the segment comparison */
export const overlayLines = (toolpath: IToolpath, layer: IToolpathLayer, indexes: number[], colour: string) => {
  const chosen = new Set(indexes)
  const lines = new LineSegments(
    layerLines(toolpath, layer, (index) => chosen.has(index)),
    new LineBasicMaterial({ color: new Color(colour), depthTest: false, transparent: true, opacity: 1 }),
  )
  lines.renderOrder = 5
  lines.raycast = () => {}
  return lines
}

/** A thin line between two points of the printer's frame (the displacement of a moved layer) */
export const segmentLine = (from: number[], to: number[], colour: string) => {
  const line = new Line(
    new BufferGeometry().setFromPoints([new Vector3().fromArray(from), new Vector3().fromArray(to)]),
    new LineBasicMaterial({ color: new Color(colour), depthTest: false }),
  )
  line.renderOrder = 6
  line.raycast = () => {}
  return line
}

/** Frees the GPU buffers of a group of lines and empties it */
export const disposeGroup = (group: Group) => {
  group.children.forEach((child) => {
    const line = child as Line
    line.geometry.dispose()
    ;(line.material as LineBasicMaterial).dispose()
  })
  group.clear()
}

/** The side and layer index of a picked line: the nearest toolpath layer group up its parents */
export const pickedLayer = (object: Object3D | null) => {
  let node = object
  while (node) {
    if (node.userData.toolpathLayer !== undefined) {
      return {
        side: node.userData.toolpathSide as IToolpathSide | undefined,
        layer: node.userData.toolpathLayer as number,
      }
    }
    node = node.parent
  }
  return null
}
