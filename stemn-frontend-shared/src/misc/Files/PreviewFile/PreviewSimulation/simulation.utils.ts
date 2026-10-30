/**
 * The simulation viewer's rules, independent of vtk.js (unit-tested, and within the main bundle's reach): colour maps and
 * their legend, which values a field shows (a component, the magnitude, or B - A), the colour range (auto, symmetric for
 * deltas, clamped, inverted), and how the diff draws each block in each colour mode on top of diff.utils' class rules.
 */
import type { IDiffEntity, IDiffFieldDelta, IDiffFieldEntity } from '../../../FileDiff/diff.types'
import { diffColours, type IDiffViewState, unifiedAppearance } from '../../../FileDiff/diff.utils'
import type { IClip } from './simulation.types'

type IRgb = [number, number, number]

/** Colour maps as stops from 0 to 1: a diverging blue-white-red for deltas (Moreland's cool to warm), viridis for values */
export const colourMaps: Record<'diverging' | 'sequential', Array<[number, IRgb]>> = {
  diverging: [
    [0, [59, 76, 192]],
    [0.25, [141, 176, 254]],
    [0.5, [221, 221, 221]],
    [0.75, [244, 154, 123]],
    [1, [180, 4, 38]],
  ],
  sequential: [
    [0, [68, 1, 84]],
    [0.125, [72, 36, 117]],
    [0.25, [65, 68, 135]],
    [0.375, [53, 95, 141]],
    [0.5, [42, 120, 142]],
    [0.625, [33, 145, 140]],
    [0.75, [34, 168, 132]],
    [0.875, [122, 209, 81]],
    [1, [253, 231, 37]],
  ],
}

export type IColourMapName = keyof typeof colourMaps

/** Values without a number (NaN) or blocks without the field */
export const missingColour: IRgb = [167, 173, 181]

/** The colour at t (0-1, clamped) of a map, inverted when asked */
export const colourAt = (name: IColourMapName, t: number, invert = false): IRgb => {
  const stops = colourMaps[name]
  const at = Math.min(1, Math.max(0, invert ? 1 - t : t))
  const upper = stops.findIndex(([stop]) => stop >= at)
  if (upper <= 0) return stops[0][1]
  const [[from, low], [to, high]] = [stops[upper - 1], stops[upper]]
  const f = (at - from) / (to - from)
  return low.map((value, channel) => Math.round(value + (high[channel] - value) * f)) as IRgb
}

/** The legend's gradient, left (range minimum) to right */
export const cssGradient = (name: IColourMapName, invert = false) =>
  `linear-gradient(to right, ${colourMaps[name]
    .map(([stop]) => `rgb(${colourAt(name, stop, invert).join(', ')}) ${Math.round(stop * 100)}%`)
    .join(', ')})`

/** Which number of a field is shown: one component, or the magnitude (the value itself for scalars) */
export type IFieldComponent = 'magnitude' | number

/**
 * One number per point or cell. A field's own values have `components` per value; a delta array (the API's B - A) has
 * one for scalars, and for vectors the components then |B| - |A|, which is its magnitude.
 */
export const displayValues = ({
  values,
  components,
  component,
  delta = false,
}: {
  values: Float32Array
  components: number
  component: IFieldComponent
  delta?: boolean
}) => {
  const width = delta && components > 1 ? components + 1 : components
  const count = Math.floor(values.length / width)
  if (width === 1) return values
  if (component !== 'magnitude')
    return Float32Array.from({ length: count }, (_, index) => values[index * width + component])
  if (delta) return Float32Array.from({ length: count }, (_, index) => values[index * width + components])
  return Float32Array.from({ length: count }, (_, index) => {
    let sum = 0
    for (let k = 0; k < components; k++) sum += values[index * width + k] ** 2
    return Math.sqrt(sum)
  })
}

/** The smallest and largest finite value of some arrays, or null */
export const finiteRange = (arrays: Float32Array[]): [number, number] | null => {
  let [min, max] = [Infinity, -Infinity]
  arrays.forEach((values) =>
    values.forEach((value) => {
      if (!Number.isFinite(value)) return
      if (value < min) min = value
      if (value > max) max = value
    }),
  )
  return min <= max ? [min, max] : null
}

/** A range centred on zero that holds every value: deltas read as "less" (blue) and "more" (red) */
export const symmetricRange = (arrays: Float32Array[]): [number, number] => {
  const range = finiteRange(arrays)
  const limit = range ? Math.max(Math.abs(range[0]), Math.abs(range[1])) : 0
  return limit > 0 ? [-limit, limit] : [-1, 1]
}

/** An RGB colour per value, by where it falls in the range (values outside it take the end colours) */
export const colourValues = (values: Float32Array, range: [number, number], name: IColourMapName, invert = false) => {
  const colours = new Uint8Array(values.length * 3)
  const span = range[1] - range[0]
  values.forEach((value, index) => {
    const rgb = Number.isFinite(value)
      ? colourAt(name, span > 0 ? (value - range[0]) / span : 0.5, invert)
      : missingColour
    colours.set(rgb, index * 3)
  })
  return colours
}

const significant = (value: number) => Number(value.toPrecision(4)) + 0

/** A value for the legend and the panel: four significant figures, and a sign for deltas */
export const formatFieldNumber = (value: number, signed = false) => {
  const text = String(significant(value))
  return signed && value > 0 ? `+${text}` : text
}

/** The legend's labels: the ends and the middle of the range */
export const legendTicks = (range: [number, number], signed = false) =>
  [range[0], (range[0] + range[1]) / 2, range[1]].map((value) => formatFieldNumber(value, signed))

/** What the panel says about a field's delta: "-0.25 … +0.5, mean +0.1111, RMS 0.2966, 20 of 27 changed" */
export const fieldDeltaSummary = (delta: IDiffFieldDelta, association: 'point' | 'cell') =>
  `${formatFieldNumber(delta.min, true)} … ${formatFieldNumber(delta.max, true)}, mean ${formatFieldNumber(
    delta.mean,
    true,
  )}, RMS ${formatFieldNumber(delta.rms)}, ${delta.changed} of ${delta.count} ${association === 'point' ? 'points' : 'cells'} changed`

/** What the viewer colours by: the diff classes, a field of A or of B, or B - A */
export type IColourMode = 'classes' | 'a' | 'b' | 'delta'

export const colourModeNames: Record<IColourMode, string> = {
  classes: 'Classes',
  a: 'A',
  b: 'B',
  delta: 'Δ',
}

/** One revision's copy of a block: its colour or what colours it, how opaque, and where along a move */
export interface ISimulationCopy {
  colour: string
  opacity: number
  /** 0-1 along the move from A's placement to B's (moved blocks) */
  placement?: number
  /** Coloured by the field's values in this revision, or by B - A */
  colourBy?: 'field' | 'delta'
}

export interface ISimulationAppearance {
  a: ISimulationCopy | null
  b: ISimulationCopy | null
  line: boolean
}

/** Whether B - A can be drawn on an entity: both revisions have it, with the same cells */
export const comparable = (entity: IDiffEntity, fieldEntity?: IDiffFieldEntity) =>
  Boolean(entity.idA && entity.idB && fieldEntity && fieldEntity.topology === 'same')

/**
 * How the diff draws an entity's blocks.
 * - classes: diff.utils' unified rules (added green, removed red ghost, modified amber over its A ghost, moved blue)
 * - a / b: that revision's blocks coloured by the field, the other revision hidden
 * - delta: blocks with the same cells in A and B coloured by B - A where B is; the rest keep their class treatment
 *   (a block meshed again is modified, and its fields cannot be compared value by value)
 */
export const simulationAppearance = (
  entity: IDiffEntity,
  state: IDiffViewState,
  mode: IColourMode,
  fieldEntity?: IDiffFieldEntity,
): ISimulationAppearance => {
  if (mode === 'a' || mode === 'b') {
    const has = mode === 'a' ? entity.idA : entity.idB
    const copy: ISimulationCopy | null = has ? { colour: diffColours.unchanged, opacity: 1, colourBy: 'field' } : null
    return mode === 'a' ? { a: copy, b: null, line: false } : { a: null, b: copy, line: false }
  }
  if (mode === 'delta' && comparable(entity, fieldEntity)) {
    return { a: null, b: { colour: diffColours.unchanged, opacity: 1, placement: 1, colourBy: 'delta' }, line: false }
  }
  const { a, b, line } = unifiedAppearance(entity, state)
  const copy = (appearance: typeof a): ISimulationCopy | null =>
    appearance
      ? {
          colour: appearance.colour,
          opacity: appearance.opacity,
          ...(appearance.placement === undefined ? {} : { placement: appearance.placement }),
        }
      : null
  return { a: copy(a), b: copy(b), line }
}

/** The fields the selector offers, from the manifest's fields section (or a scene's own fields for one revision) */
export const fieldNames = (fields: Array<{ name: string }>) => fields.map((field) => field.name)

/** The component choices of a field: the magnitude (or the value of a scalar), then X, Y, Z for vectors */
export const componentOptions = (components: number): Array<{ value: IFieldComponent; label: string }> =>
  components === 1
    ? [{ value: 'magnitude', label: 'Value' }]
    : [
        { value: 'magnitude', label: 'Magnitude' },
        ...Array.from({ length: components }, (_, index) => ({ value: index, label: 'XYZ'[index] || String(index) })),
      ]

/** The viewer's colour settings */
export interface IFieldView {
  mode: IColourMode
  /** The field shown, or null to colour by block (or class) */
  field: string | null
  component: IFieldComponent
  /** The range follows the values shown; off, it is `limit` (±limit for deltas) or `min` to `max` */
  auto: boolean
  limit: number
  min: number
  max: number
  invert: boolean
  clip: IClip | null
}

export const initialFieldView = (field: string | null = null): IFieldView => ({
  mode: 'classes',
  field,
  component: 'magnitude',
  auto: true,
  limit: 1,
  min: 0,
  max: 1,
  invert: false,
  clip: null,
})
