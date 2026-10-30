import { describe, expect, it } from 'vitest'
import manifestFixture from './__fixtures__/bracket-assembly.diff.json'
import type { IDiffEntity, IDiffManifest } from './diff.types'
import {
  applyShortcut,
  classSummary,
  countsOf,
  defaultFilters,
  diffColours,
  diffUrl,
  formatDelta,
  formatValue,
  ghostOpacity,
  initialViewState,
  panelEntities,
  removedOpacity,
  shortcutFor,
  sideBySideAppearance,
  toggleSwap,
  unifiedAppearance,
} from './diff.utils'

// the manifest the backend's diff engine computes for bracket-assembly-v1.step -> v2.step
const manifest = manifestFixture as unknown as IDiffManifest
const entity = (id: string) => manifest.entities.find((candidate) => candidate.id === `bracket-assembly/${id}`)!

describe('the unified view', () => {
  const state = initialViewState()

  it('draws added entities solid green in B only', () => {
    expect(unifiedAppearance(entity('washer'), state)).toEqual({
      a: null,
      b: { colour: diffColours.added, opacity: 1, transparent: false, renderOrder: 0 },
      line: false,
    })
  })

  it('draws removed entities red at ~30% in their A position, after the opaque geometry', () => {
    expect(unifiedAppearance(entity('pin'), state)).toEqual({
      a: { colour: diffColours.removed, opacity: removedOpacity, transparent: true, renderOrder: 2 },
      b: null,
      line: false,
    })
  })

  it('draws modified entities with B solid amber and A ghosted at ~25%', () => {
    const { a, b, line } = unifiedAppearance(entity('base-plate'), state)
    expect(b).toEqual({ colour: diffColours.modified, opacity: 1, transparent: false, renderOrder: 0 })
    expect(a).toEqual({ colour: diffColours.modified, opacity: ghostOpacity, transparent: true, renderOrder: 1 })
    expect(line).toBe(false)
  })

  it('crossfades modified entities along the A -> B slider, and the swap reverses it', () => {
    const atA = unifiedAppearance(entity('bracket'), { ...state, blend: 0 })
    expect(atA.a!.opacity).toBe(1)
    expect(atA.a!.transparent).toBe(false)
    expect(atA.b!.opacity).toBe(ghostOpacity)

    const halfway = unifiedAppearance(entity('bracket'), { ...state, blend: 0.5 })
    expect(halfway.a!.opacity).toBeCloseTo(0.625)
    expect(halfway.b!.opacity).toBeCloseTo(0.625)

    const swapped = unifiedAppearance(entity('bracket'), toggleSwap(state, entity('bracket').id))
    expect(swapped.a!.opacity).toBe(1)
    expect(swapped.b!.opacity).toBe(ghostOpacity)
  })

  it('draws moved entities with B solid blue, A ghosted and a displacement line; the slider moves B', () => {
    const appearance = unifiedAppearance(entity('spacer'), state)
    expect(appearance.a).toEqual({
      colour: diffColours.moved,
      opacity: ghostOpacity,
      transparent: true,
      renderOrder: 1,
    })
    expect(appearance.b).toMatchObject({ colour: diffColours.moved, opacity: 1, placement: 1 })
    expect(appearance.line).toBe(true)
    expect(unifiedAppearance(entity('spacer'), { ...state, blend: 0.25 }).b!.placement).toBe(0.25)
  })

  it('draws unchanged entities neutral, and hides them with "changes only"', () => {
    expect(unifiedAppearance(entity('nut'), state)).toEqual({
      a: null,
      b: { colour: diffColours.unchanged, opacity: 1, transparent: false, renderOrder: 0 },
      line: false,
    })
    expect(unifiedAppearance(entity('nut'), { ...state, changesOnly: true })).toEqual({ a: null, b: null, line: false })
  })

  it('draws a class whose filter is off like unchanged context; removed entities disappear', () => {
    const filters = { ...defaultFilters, modified: false, removed: false }
    expect(unifiedAppearance(entity('bracket'), { ...state, filters }).b!.colour).toBe(diffColours.unchanged)
    expect(unifiedAppearance(entity('bracket'), { ...state, filters }).a).toBeNull()
    expect(unifiedAppearance(entity('pin'), { ...state, filters })).toEqual({ a: null, b: null, line: false })
    expect(unifiedAppearance(entity('bracket'), { ...state, filters, changesOnly: true }).b).toBeNull()
  })
})

describe('the side-by-side view', () => {
  const state = initialViewState()

  it('colours A and B by class, each solid', () => {
    expect(sideBySideAppearance(entity('washer'), state)).toEqual({
      a: null,
      b: expect.objectContaining({ colour: diffColours.added, opacity: 1 }),
    })
    expect(sideBySideAppearance(entity('pin'), state)).toEqual({
      a: expect.objectContaining({ colour: diffColours.removed, opacity: 1 }),
      b: null,
    })
    expect(sideBySideAppearance(entity('spacer'), state).a!.colour).toBe(diffColours.moved)
    expect(sideBySideAppearance(entity('spacer'), state).b!.colour).toBe(diffColours.moved)
    expect(sideBySideAppearance(entity('nut'), state).a!.colour).toBe(diffColours.unchanged)
    expect(sideBySideAppearance(entity('nut'), { ...state, changesOnly: true })).toEqual({ a: null, b: null })
  })
})

describe('filters and the entity panel', () => {
  it('starts with every class but Unchanged on', () => {
    expect(defaultFilters).toEqual({ added: true, removed: true, modified: true, moved: true, unchanged: false })
  })

  it('lists the filtered classes in filter order, by label', () => {
    expect(panelEntities(manifest.entities, defaultFilters).map((row) => `${row.class}:${row.label}`)).toEqual([
      'added:washer',
      'removed:pin',
      'modified:base-plate',
      'modified:bracket',
      'moved:spacer',
    ])
    expect(panelEntities(manifest.entities, { ...defaultFilters, unchanged: true })).toHaveLength(6)
  })

  it('counts the classes as the manifest does', () => {
    expect(countsOf(manifest.entities)).toEqual(manifest.counts)
    expect(manifest.counts).toEqual({ added: 1, removed: 1, modified: 2, moved: 1, unchanged: 1 })
  })

  it('summarises each class for the panel', () => {
    expect(classSummary(entity('washer'))).toBe('Added in B')
    expect(classSummary(entity('pin'))).toBe('Removed in B')
    expect(classSummary(entity('spacer'))).toBe('Moved 60 mm')
    expect(classSummary(entity('bracket'))).toBe('Modified')
    expect(classSummary({ ...entity('spacer'), move: { translation: [0, 0, 0], distance: 0, rotation: 90 } })).toBe(
      'Moved 0 mm, turned 90°',
    )
  })

  it('formats attribute values and deltas with their units', () => {
    const [faces, , volume] = entity('base-plate').changes
    expect(formatValue(faces.a)).toBe('10')
    expect(formatDelta(faces)).toBe('+1')
    expect(formatValue(volume.b, 'mm3')).toBe('34,492 mm³')
    expect(formatDelta(volume, 'mm3')).toBe('-301.6 mm³')
    expect(formatValue([100, 60, 6], 'mm')).toBe('100 × 60 × 6 mm')
    expect(formatValue(null)).toBe('–')
  })
})

describe('keyboard shortcuts', () => {
  it('maps keys to actions, never while typing in a field', () => {
    expect(shortcutFor({ key: '1' })).toEqual({ type: 'filter', diffClass: 'added' })
    expect(shortcutFor({ key: '5' })).toEqual({ type: 'filter', diffClass: 'unchanged' })
    expect(shortcutFor({ key: 'C' })).toEqual({ type: 'changesOnly' })
    expect(shortcutFor({ key: 's' })).toEqual({ type: 'view', view: 'sideBySide' })
    expect(shortcutFor({ key: ']' })).toEqual({ type: 'blend', by: 0.1 })
    expect(shortcutFor({ key: 'Escape' })).toEqual({ type: 'clear' })
    expect(shortcutFor({ key: 'c', target: { tagName: 'INPUT', type: 'text' } })).toBeNull()
    expect(shortcutFor({ key: 'c', target: { tagName: 'INPUT', type: 'range' } })).toEqual({ type: 'changesOnly' })
    expect(shortcutFor({ key: 'c', ctrlKey: true })).toBeNull()
    expect(shortcutFor({ key: 'q' })).toBeNull()
  })

  it('applies them to the view state', () => {
    const state = initialViewState()
    expect(applyShortcut(state, { type: 'filter', diffClass: 'unchanged' }).filters.unchanged).toBe(true)
    expect(applyShortcut(state, { type: 'changesOnly' }).changesOnly).toBe(true)
    expect(applyShortcut(state, { type: 'blend', by: 0.1 }).blend).toBe(1)
    expect(applyShortcut(state, { type: 'blend', by: -0.1 }).blend).toBe(0.9)
    expect(applyShortcut(state, { type: 'blend', to: 0 }).blend).toBe(0)
    expect(toggleSwap(toggleSwap(state, 'x'), 'x').swapped.has('x')).toBe(false)
  })
})

it('builds the diff route url', () => {
  expect(diffUrl({ projectId: 'p', fileId: 'f', revisionA: 'a', revisionB: 'b' })).toBe(
    'http://localhost:3000/api/v1/sync/diff/p/f/a/b',
  )
})

it('the fixture has one entity record per part of either revision', () => {
  const ids = manifest.entities.map((record: IDiffEntity) => record.id).sort()
  expect(ids).toEqual(['base-plate', 'bracket', 'nut', 'pin', 'spacer', 'washer'].map((id) => `bracket-assembly/${id}`))
})
