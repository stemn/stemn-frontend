/**
 * The toolpath of a G-code render (`toolpath.bin`, stemn-backend services/cad-converter/converter/toolpath.py): every
 * layer is its start point and the end of each of its moves, with the move's kind (0 travel, n the n-th feature) and
 * speed. Parsing and the per-layer comparison the diff view draws, without three.js (unit-tested on its own).
 */

/** One layer of the toolpath: its moves are `segment` to `segment + count`, its points `point` to `point + count` */
export interface IToolpathLayer {
  /** The layer's scene entity id: its height above the first layer, e.g. 'layer:z+1.200' */
  id: string
  /** Millimetres */
  z: number
  height: number
  point: number
  segment: number
  count: number
}

export interface IToolpath {
  version: number
  units: 'mm'
  slicer: string
  milling: boolean
  /** The feature of kind n is features[n - 1] */
  features: string[]
  bounds: { min: number[]; max: number[] }
  segments: number
  layers: IToolpathLayer[]
  /** x, y pairs */
  points: Float32Array
  kinds: Uint8Array
  /** Millimetres a second */
  speeds: Uint16Array
}

/** The features' colours, PrusaSlicer's (the converter's thumbnails use the same) */
export const featureColours: Record<string, string> = {
  custom: '#5ed194',
  'outer-wall': '#ff7d38',
  'inner-wall': '#ffe64d',
  'overhang-wall': '#0000ff',
  infill: '#b03029',
  'solid-infill': '#9654cc',
  'top-surface': '#f04040',
  'bottom-surface': '#9654cc',
  bridge: '#4d80ba',
  'gap-fill': '#e0e0e0',
  support: '#00ff00',
  'support-interface': '#008000',
  skirt: '#00876e',
  brim: '#00876e',
  'prime-tower': '#b3e3ab',
  ironing: '#ff8c69',
  cut: '#3a7bd5',
  other: '#a7adb5',
}

export const travelColour = '#8c95a3'

export const featureNames: Record<string, string> = {
  custom: 'Custom',
  'outer-wall': 'Outer wall',
  'inner-wall': 'Inner wall',
  'overhang-wall': 'Overhang wall',
  infill: 'Infill',
  'solid-infill': 'Solid infill',
  'top-surface': 'Top surface',
  'bottom-surface': 'Bottom surface',
  bridge: 'Bridge',
  'gap-fill': 'Gap fill',
  support: 'Support',
  'support-interface': 'Support interface',
  skirt: 'Skirt',
  brim: 'Brim',
  'prime-tower': 'Prime tower',
  ironing: 'Ironing',
  cut: 'Cut',
  other: 'Other',
}

export const slicerNames: Record<string, string> = {
  prusaslicer: 'PrusaSlicer',
  superslicer: 'SuperSlicer',
  orcaslicer: 'OrcaSlicer',
  bambustudio: 'Bambu Studio',
  cura: 'Cura',
  simplify3d: 'Simplify3D',
  ideamaker: 'ideaMaker',
  kisslicer: 'KISSlicer',
}

/** The extensions the G-code viewer opens */
export const toolpathExtensions = ['gcode', 'gco', 'g', 'nc']

export const isToolpathFile = (name?: string) =>
  Boolean(name) && toolpathExtensions.includes((name as string).split('.').pop()!.toLowerCase())

export class ToolpathFormatError extends Error {}

/** Reads toolpath.bin: 'STGC', version, header length, the JSON header, then the arrays it names */
export const parseToolpath = (buffer: ArrayBuffer): IToolpath => {
  const view = new DataView(buffer)
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength)))
  if (magic !== 'STGC') throw new ToolpathFormatError('This is not a Stemn toolpath (toolpath.bin).')
  const version = view.getUint32(4, true)
  if (version !== 1) throw new ToolpathFormatError(`Toolpath version ${version} is not supported.`)
  const headerLength = view.getUint32(8, true)
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 12, headerLength)))
  const start = 12 + headerLength
  const array = <T>(
    name: string,
    Type: { new (buffer: ArrayBuffer, offset: number, length: number): T },
    size: number,
  ) => new Type(buffer, start + header.arrays[name].offset, header.arrays[name].length / size)
  return {
    ...header,
    points: array('points', Float32Array, 4),
    kinds: array('kinds', Uint8Array, 1),
    speeds: array('speeds', Uint16Array, 2),
  }
}

/** Fetches a render's toolpath with the user's token */
export const loadToolpath = async (url: string, token?: string | null) => {
  const response = await fetch(url, { headers: token ? { Authorization: `bearer ${token}` } : {} })
  if (!response.ok) {
    let message = `The toolpath could not be downloaded (${response.status}).`
    try {
      message = (await response.json()).error.message || message
    } catch {}
    throw new Error(message)
  }
  return parseToolpath(await response.arrayBuffer())
}

/** The features a layer (or the whole toolpath) extrudes, in the toolpath's order */
export const featuresOf = (toolpath: IToolpath, layers: IToolpathLayer[] = toolpath.layers) => {
  const seen = new Set<number>()
  layers.forEach((layer) => {
    for (let index = layer.segment; index < layer.segment + layer.count; index++) {
      if (toolpath.kinds[index]) seen.add(toolpath.kinds[index])
    }
  })
  return [...seen].sort((x, y) => x - y).map((kind) => toolpath.features[kind - 1])
}

/** A layer's extrusion path length and move count, in millimetres */
export const layerStats = (toolpath: IToolpath, layer: IToolpathLayer) => {
  let extrusions = 0
  let length = 0
  for (let index = 0; index < layer.count; index++) {
    if (!toolpath.kinds[layer.segment + index]) continue
    const from = (layer.point + index) * 2
    extrusions++
    length += Math.hypot(
      toolpath.points[from + 2] - toolpath.points[from],
      toolpath.points[from + 3] - toolpath.points[from + 1],
    )
  }
  return { extrusions, moves: layer.count, length }
}

/** Precision of the segment comparison: 10 µm, coarser than float32 noise at printer coordinates */
const grid = 100

const key = (x0: number, y0: number, x1: number, y1: number) => {
  const a = `${Math.round(x0 * grid)},${Math.round(y0 * grid)}`
  const b = `${Math.round(x1 * grid)},${Math.round(y1 * grid)}`
  // a move drawn the other way round is the same line
  return a < b ? `${a};${b}` : `${b};${a}`
}

const extrusionKeys = (toolpath: IToolpath, layer: IToolpathLayer) => {
  const keys = new Map<string, number[]>()
  for (let index = 0; index < layer.count; index++) {
    if (!toolpath.kinds[layer.segment + index]) continue
    const from = (layer.point + index) * 2
    const { points } = toolpath
    const segmentKey = key(points[from], points[from + 1], points[from + 2], points[from + 3])
    const list = keys.get(segmentKey)
    if (list) list.push(index)
    else keys.set(segmentKey, [index])
  }
  return keys
}

export interface ISegmentComparison {
  /** Move indexes within layer A extruded only in A */
  aOnly: number[]
  /** Move indexes within layer B extruded only in B */
  bOnly: number[]
  /** Move indexes within layer B that A extrudes too */
  shared: number[]
}

/**
 * Which extrusions of one layer A has and B has not, and the other way round (a line drawn the other way round is the
 * same line): the segment-level view of a modified layer. Cheap enough to run on every selection, one layer at a time.
 */
export const compareLayers = (
  a: { toolpath: IToolpath; layer: IToolpathLayer },
  b: { toolpath: IToolpath; layer: IToolpathLayer },
): ISegmentComparison => {
  const keysA = extrusionKeys(a.toolpath, a.layer)
  const keysB = extrusionKeys(b.toolpath, b.layer)
  const aOnly: number[] = []
  const bOnly: number[] = []
  const shared: number[] = []
  keysA.forEach((indexes, segmentKey) => {
    const inB = (keysB.get(segmentKey) || []).length
    // a line A extrudes twice and B once is once only in A
    indexes.slice(inB).forEach((index) => aOnly.push(index))
  })
  keysB.forEach((indexes, segmentKey) => {
    const inA = (keysA.get(segmentKey) || []).length
    indexes.slice(0, inA).forEach((index) => shared.push(index))
    indexes.slice(inA).forEach((index) => bOnly.push(index))
  })
  const ascending = (x: number, y: number) => x - y
  return { aOnly: aOnly.sort(ascending), bOnly: bOnly.sort(ascending), shared: shared.sort(ascending) }
}

/** The layers' heights of two toolpaths together, lowest first: the diff view's layer slider */
export const layerHeights = (...toolpaths: Array<IToolpath | null | undefined>) =>
  [...new Set(toolpaths.flatMap((toolpath) => (toolpath ? toolpath.layers.map((layer) => layer.z) : [])))].sort(
    (x, y) => x - y,
  )

/** The viewer's status line: the slicer, layers and moves */
export const toolpathSummary = (toolpath: IToolpath) =>
  [
    slicerNames[toolpath.slicer] || (toolpath.milling ? 'Milling' : null),
    `${toolpath.layers.length} ${toolpath.layers.length === 1 ? 'layer' : 'layers'}`,
    `${toolpath.segments.toLocaleString()} moves`,
  ]
    .filter(Boolean)
    .join(' · ')
