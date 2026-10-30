/**
 * The diff viewer's rules, independent of the renderer: class colours, what each class looks like in the unified view
 * and the side-by-side view, filters, the entity panel's rows and the keyboard shortcuts. Every viewer (3D CAD here;
 * PCB, AEC, additive and simulation later) draws entities by these rules, so they look and behave the same.
 * No three.js in this file: it is in the main bundle's reach and unit-tested on its own.
 */
import type { IDiffAttributeDelta, IDiffClass, IDiffCounts, IDiffEntity, IDiffFieldDelta } from './diff.types'

/** In the order the filters and the entity panel show them */
export const diffClasses: IDiffClass[] = ['added', 'removed', 'modified', 'moved', 'unchanged']

export const diffClassNames: Record<IDiffClass, string> = {
  added: 'Added',
  removed: 'Removed',
  modified: 'Modified',
  moved: 'Moved',
  unchanged: 'Unchanged',
}

/** Accents: green, red, amber, blue and a neutral grey (stemn-frontend docs/DIFF-VIEWERS.md) */
export const diffColours: Record<IDiffClass, string> = {
  added: '#2f9e58',
  removed: '#d64541',
  modified: '#e8a317',
  moved: '#3a7bd5',
  unchanged: '#a7adb5',
}

/** Removed entities are drawn this opaque in their A position */
export const removedOpacity = 0.3
/** The ghost of a modified or moved entity (A, or B after a swap) */
export const ghostOpacity = 0.25

/** The class filters: on draws the class with its treatment and lists it in the entity panel */
export type IDiffFilters = Record<IDiffClass, boolean>

/** All but Unchanged on (unchanged entities are still drawn, neutral, unless "changes only" is on) */
export const defaultFilters: IDiffFilters = {
  added: true,
  removed: true,
  modified: true,
  moved: true,
  unchanged: false,
}

export interface IDiffViewState {
  filters: IDiffFilters
  /** Hide everything that is not drawn with a change treatment */
  changesOnly: boolean
  /** The A -> B slider: 0 shows A, 1 shows B (the default) */
  blend: number
  /** Entities whose A and B are swapped (A solid, B ghosted) */
  swapped: Set<string>
}

export const initialViewState = (): IDiffViewState => ({
  filters: { ...defaultFilters },
  changesOnly: false,
  blend: 1,
  swapped: new Set(),
})

/** How one revision's copy of an entity is drawn */
export interface IDiffAppearance {
  colour: string
  opacity: number
  /** Transparent copies are drawn after the opaque ones (renderOrder), depth-tested, and do not write depth */
  transparent: boolean
  renderOrder: number
  /** 0-1 along the move from A's placement to B's (only for B copies of moved entities) */
  placement?: number
}

export interface IDiffEntityAppearance {
  /** A's copy of the entity (null: not drawn) */
  a: IDiffAppearance | null
  /** B's copy */
  b: IDiffAppearance | null
  /** Draw the displacement line between the A and B centres */
  line: boolean
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t
const clamp = (value: number) => Math.min(1, Math.max(0, value))

const solid = (colour: string): IDiffAppearance => ({ colour, opacity: 1, transparent: false, renderOrder: 0 })
const faded = (colour: string, opacity: number): IDiffAppearance =>
  opacity >= 1 ? solid(colour) : { colour, opacity, transparent: true, renderOrder: 1 }

const hidden: IDiffEntityAppearance = { a: null, b: null, line: false }

/**
 * The unified view: A and B overlaid in one scene.
 * - added: B solid green
 * - removed: A at ~30% red in its A position, drawn after the opaque geometry
 * - modified: B solid amber with A ghosted (~25%) in place; the slider crossfades A -> B, the swap shows A solid
 * - moved: B solid blue, A ghosted, a displacement line; the slider moves B from A's placement to its own
 * - unchanged: B neutral grey
 * A class whose filter is off is drawn like unchanged (B neutral; removed entities disappear), and "changes only"
 * hides everything drawn neutral.
 */
export const unifiedAppearance = (entity: IDiffEntity, state: IDiffViewState): IDiffEntityAppearance => {
  const highlighted = state.filters[entity.class] && entity.class !== 'unchanged'
  if (!highlighted) {
    if (state.changesOnly || entity.class === 'removed') return hidden
    return { a: null, b: solid(diffColours.unchanged), line: false }
  }
  const colour = diffColours[entity.class]
  // 1 shows B, 0 shows A; a swapped entity runs the other way
  const t = clamp(state.swapped.has(entity.id) ? 1 - state.blend : state.blend)
  switch (entity.class) {
    case 'added':
      return { a: null, b: solid(colour), line: false }
    case 'removed':
      return { a: { colour, opacity: removedOpacity, transparent: true, renderOrder: 2 }, b: null, line: false }
    case 'modified':
      return {
        a: faded(colour, lerp(1, ghostOpacity, t)),
        b: faded(colour, lerp(ghostOpacity, 1, t)),
        line: Boolean(entity.move),
      }
    case 'moved':
      return {
        a: faded(colour, ghostOpacity),
        b: { ...solid(colour), placement: t },
        line: true,
      }
    default:
      return hidden
  }
}

/**
 * The side-by-side view: A on the left, B on the right, each opaque, coloured by class (A: removed, modified, moved;
 * B: added, modified, moved), the rest neutral.
 */
export const sideBySideAppearance = (
  entity: IDiffEntity,
  state: IDiffViewState,
): { a: IDiffAppearance | null; b: IDiffAppearance | null } => {
  const highlighted = state.filters[entity.class] && entity.class !== 'unchanged'
  const neutral = state.changesOnly ? null : solid(diffColours.unchanged)
  const accent = highlighted ? solid(diffColours[entity.class]) : neutral
  const copy = entity.class === 'unchanged' ? neutral : accent
  return {
    a: entity.class === 'added' ? null : copy,
    b: entity.class === 'removed' ? null : copy,
  }
}

/**
 * The entity panel's rows: the classes whose filter is on, grouped by class in filter order, by label within a class
 * (numbers in order: Layer 2 before Layer 10)
 */
export const panelEntities = (entities: IDiffEntity[], filters: IDiffFilters) =>
  diffClasses
    .filter((diffClass) => filters[diffClass])
    .flatMap((diffClass) =>
      entities
        .filter((entity) => entity.class === diffClass)
        .sort(
          (x, y) =>
            x.label.localeCompare(y.label, undefined, { numeric: true }) ||
            x.id.localeCompare(y.id, undefined, { numeric: true }),
        ),
    )

export const countsOf = (entities: IDiffEntity[]): IDiffCounts =>
  Object.fromEntries(
    diffClasses.map((diffClass) => [diffClass, entities.filter((entity) => entity.class === diffClass).length]),
  ) as IDiffCounts

/** What the entity panel says about an entity's class */
export const classSummary = (entity: IDiffEntity, lengthUnit = 'm') => {
  switch (entity.class) {
    case 'added':
      return 'Added in B'
    case 'removed':
      return 'Removed in B'
    case 'modified':
      return entity.move ? `Modified, and moved ${formatLength(entity.move.distance, lengthUnit)}` : 'Modified'
    case 'moved':
      return entity.move
        ? `Moved ${formatLength(entity.move.distance, lengthUnit)}${
            entity.move.rotation > 0.05 ? `, turned ${formatNumber(entity.move.rotation)}°` : ''
          }`
        : 'Moved'
    default:
      return 'Unchanged'
  }
}

const formatNumber = (value: number) => {
  const rounded = Number(value.toPrecision(6))
  return Math.abs(rounded) >= 1000 ? rounded.toLocaleString('en', { maximumFractionDigits: 1 }) : String(rounded)
}

/**
 * Lengths in the scene's unit: metres and millimetres are shown in millimetres (CAD and IFC scenes are in metres, PCBs
 * and most drawings in millimetres), any other unit (a drawing in inches, or without units) as it is
 */
export const formatLength = (value: number, unit = 'm') => {
  if (unit === 'm' || unit === 'mm') return `${formatNumber(unit === 'm' ? value * 1000 : value)} mm`
  return unit === 'unit' ? formatNumber(value) : `${formatNumber(value)} ${unit}`
}

const unitLabels: Record<string, string> = { mm3: 'mm³', mm2: 'mm²', mm: 'mm' }

/** One attribute value for the deltas table, with its unit when the scene names one */
export const formatValue = (value: any, unit?: string) => {
  if (value === null || value === undefined) return '–'
  if (unit === 'range') return formatRange(value)
  const suffix = unit ? ` ${unitLabels[unit] || unit}` : ''
  if (typeof value === 'number') return `${formatNumber(value)}${suffix}`
  if (Array.isArray(value) && value.every((item) => typeof item === 'number'))
    return `${value.map(formatNumber).join(' × ')}${suffix}`
  // named numbers, e.g. a G-code layer's path length per feature
  if (typeof value === 'object' && Object.values(value).every((item) => typeof item === 'number'))
    return Object.entries(value)
      .map(([name, item]) => `${name} ${formatNumber(item as number)}${suffix}`)
      .join(', ')
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

/** The signed change of a delta, e.g. "+148" or "-301.6 mm³" */
export const formatDelta = (change: IDiffAttributeDelta, unit?: string) => {
  if (change.delta === undefined) return ''
  const sign = (value: number) => (value > 0 ? `+${formatNumber(value)}` : formatNumber(value))
  if (isFieldDelta(change.delta)) return `${sign(change.delta.min)} … ${sign(change.delta.max)}`
  const suffix = unit ? ` ${unitLabels[unit] || unit}` : ''
  return Array.isArray(change.delta)
    ? `${change.delta.map(sign).join(' × ')}${suffix}`
    : `${sign(change.delta)}${suffix}`
}

/**
 * Field changes (simulation results, the manifest's optional `fields` section): the scene's units call their values
 * 'range', [min, max], and their delta is the statistics of B - A over the entity's points or cells
 */
export const isFieldDelta = (delta: IDiffAttributeDelta['delta']): delta is IDiffFieldDelta =>
  Boolean(delta) && typeof delta === 'object' && !Array.isArray(delta)

export const formatRange = (range: any) =>
  Array.isArray(range) && range.length === 2 ? `${formatNumber(range[0])} … ${formatNumber(range[1])}` : '–'

export const diffUrl = ({
  projectId,
  fileId,
  revisionA,
  revisionB,
}: {
  projectId: string
  fileId: string
  revisionA: string
  revisionB: string
}) => `${GLOBAL_ENV.API_SERVER}/api/v1/sync/diff/${projectId}/${fileId}/${revisionA}/${revisionB}`

/** The keyboard shortcuts of the diff view (also listed in its help popover and docs/DIFF-VIEWERS.md) */
export const diffShortcuts: Array<{ keys: string; action: string }> = [
  { keys: '1 – 5', action: 'Toggle the Added, Removed, Modified, Moved and Unchanged filters' },
  { keys: 'C', action: 'Changes only (hide unchanged geometry)' },
  { keys: 'U / S', action: 'Unified view / side-by-side view' },
  { keys: '[ / ]', action: 'Move the A → B slider towards A / towards B' },
  { keys: 'A / B', action: 'Slider fully to A / fully to B' },
  { keys: 'X', action: 'Swap A and B for the selected entity' },
  { keys: 'F', action: 'Fit the model (or the selected entity) to the view' },
  { keys: 'Esc', action: 'Clear the selection' },
]

export type IDiffShortcut =
  | { type: 'filter'; diffClass: IDiffClass }
  | { type: 'changesOnly' }
  | { type: 'view'; view: 'unified' | 'sideBySide' }
  | { type: 'blend'; to?: number; by?: number }
  | { type: 'swap' }
  | { type: 'fit' }
  | { type: 'clear' }

/** The shortcut a key press means, or null (typing in a form field never triggers one) */
export const shortcutFor = (event: {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  target?: any
}): IDiffShortcut | null => {
  if (event.ctrlKey || event.metaKey || event.altKey) return null
  const tag = event.target && event.target.tagName
  if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && event.target.type !== 'range') return null
  const key = event.key.toLowerCase()
  const index = ['1', '2', '3', '4', '5'].indexOf(key)
  if (index >= 0) return { type: 'filter', diffClass: diffClasses[index] }
  switch (key) {
    case 'c':
      return { type: 'changesOnly' }
    case 'u':
      return { type: 'view', view: 'unified' }
    case 's':
      return { type: 'view', view: 'sideBySide' }
    case '[':
      return { type: 'blend', by: -0.1 }
    case ']':
      return { type: 'blend', by: 0.1 }
    case 'a':
      return { type: 'blend', to: 0 }
    case 'b':
      return { type: 'blend', to: 1 }
    case 'x':
      return { type: 'swap' }
    case 'f':
      return { type: 'fit' }
    case 'escape':
      return { type: 'clear' }
    default:
      return null
  }
}

/** Applies a shortcut to the view state (view changes, swaps of the selection, fit and clear are the caller's) */
export const applyShortcut = (state: IDiffViewState, shortcut: IDiffShortcut): IDiffViewState => {
  switch (shortcut.type) {
    case 'filter':
      return { ...state, filters: { ...state.filters, [shortcut.diffClass]: !state.filters[shortcut.diffClass] } }
    case 'changesOnly':
      return { ...state, changesOnly: !state.changesOnly }
    case 'blend':
      return {
        ...state,
        blend: clamp(
          shortcut.to !== undefined ? shortcut.to : Math.round((state.blend + (shortcut.by || 0)) * 10) / 10,
        ),
      }
    default:
      return state
  }
}

export const toggleSwap = (state: IDiffViewState, id: string): IDiffViewState => {
  const swapped = new Set(state.swapped)
  if (swapped.has(id)) swapped.delete(id)
  else swapped.add(id)
  return { ...state, swapped }
}
