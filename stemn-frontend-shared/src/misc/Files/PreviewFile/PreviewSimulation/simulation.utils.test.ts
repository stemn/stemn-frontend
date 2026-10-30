import { describe, expect, it } from 'vitest'
import type { IDiffEntity, IDiffFieldEntity } from '../../../FileDiff/diff.types'
import { diffColours, formatDelta, formatValue, initialViewState } from '../../../FileDiff/diff.utils'
import { parseArray } from './simulation.client'
import {
  colourAt,
  colourValues,
  componentOptions,
  cssGradient,
  displayValues,
  fieldDeltaSummary,
  finiteRange,
  legendTicks,
  missingColour,
  simulationAppearance,
  symmetricRange,
} from './simulation.utils'

// entities as the backend's simulation adapter lists them for manifold-v1.vtk -> manifold-v2.vtk
const entity = (id: string, diffClass: IDiffEntity['class'], sides: 'ab' | 'a' | 'b' = 'ab'): IDiffEntity => ({
  id,
  idA: sides.includes('a') ? id : null,
  idB: sides.includes('b') ? id : null,
  kind: 'block',
  label: id,
  parentId: null,
  class: diffClass,
  match: { method: sides === 'ab' ? 'id' : null, confidence: sides === 'ab' ? 1 : 0 },
  changes: [],
  move: diffClass === 'moved' ? { translation: [0, 0, 0.5], distance: 0.5, rotation: 0 } : null,
  centreA: [4.5, 0.5, 0.5],
  centreB: diffClass === 'moved' ? [4.5, 0.5, 1] : [4.5, 0.5, 0.5],
  payloadRefA: sides.includes('a') ? { block: 0 } : null,
  payloadRefB: sides.includes('b') ? { block: 0 } : null,
})

const same: IDiffFieldEntity = { topology: 'same', deltas: [] }
const different: IDiffFieldEntity = { topology: 'different', deltas: [] }

describe('colour maps', () => {
  it('runs blue, white, red for deltas and dark to yellow for values, and inverts', () => {
    expect(colourAt('diverging', 0)).toEqual([59, 76, 192])
    expect(colourAt('diverging', 0.5)).toEqual([221, 221, 221])
    expect(colourAt('diverging', 1)).toEqual([180, 4, 38])
    expect(colourAt('diverging', 1, true)).toEqual([59, 76, 192])
    expect(colourAt('sequential', 0)).toEqual([68, 1, 84])
    expect(colourAt('sequential', 2)).toEqual([253, 231, 37])
    expect(colourAt('diverging', 0.125)).toEqual([100, 126, 223])
  })

  it('colours values by the range, clamping outside it, and grey without a number', () => {
    const colours = colourValues(Float32Array.from([-1, 0, 1, 5, NaN]), [-1, 1], 'diverging')
    expect(Array.from(colours.slice(0, 3))).toEqual([59, 76, 192])
    expect(Array.from(colours.slice(3, 6))).toEqual([221, 221, 221])
    expect(Array.from(colours.slice(6, 9))).toEqual([180, 4, 38])
    expect(Array.from(colours.slice(9, 12))).toEqual([180, 4, 38])
    expect(Array.from(colours.slice(12, 15))).toEqual(missingColour)
  })

  it('draws the legend with the same stops', () => {
    expect(cssGradient('diverging')).toBe(
      'linear-gradient(to right, rgb(59, 76, 192) 0%, rgb(141, 176, 254) 25%, rgb(221, 221, 221) 50%, ' +
        'rgb(244, 154, 123) 75%, rgb(180, 4, 38) 100%)',
    )
    expect(legendTicks([-1, 1], true)).toEqual(['-1', '0', '+1'])
    expect(legendTicks([0, 13.25])).toEqual(['0', '6.625', '13.25'])
  })
})

describe('the values a field shows', () => {
  const vectors = Float32Array.from([3, 4, 0, 1, 0, 0])

  it('a component or the magnitude of a field', () => {
    expect(Array.from(displayValues({ values: vectors, components: 3, component: 'magnitude' }))).toEqual([5, 1])
    expect(Array.from(displayValues({ values: vectors, components: 3, component: 1 }))).toEqual([4, 0])
    const scalars = Float32Array.from([1, 2])
    expect(displayValues({ values: scalars, components: 1, component: 'magnitude' })).toBe(scalars)
  })

  it('a delta array: the components, then |B| - |A| as its magnitude', () => {
    const delta = Float32Array.from([0.5, 0, 0, 0.5, 0.25, 0, 0, 0.25])
    expect(Array.from(displayValues({ values: delta, components: 3, component: 'magnitude', delta: true }))).toEqual([
      0.5, 0.25,
    ])
    expect(Array.from(displayValues({ values: delta, components: 3, component: 0, delta: true }))).toEqual([0.5, 0.25])
  })

  it('ranges: finite values only, symmetric about zero for deltas', () => {
    expect(finiteRange([Float32Array.from([2, NaN, -1]), Float32Array.from([7])])).toEqual([-1, 7])
    expect(finiteRange([Float32Array.from([NaN])])).toBeNull()
    // the manifold's p: -0.25 to 0.5 on the inlet, -1 on the outlet
    expect(symmetricRange([Float32Array.from([-0.25, 0.5]), Float32Array.from([-1, -1])])).toEqual([-1, 1])
    expect(symmetricRange([Float32Array.from([0, 0])])).toEqual([-1, 1])
  })

  it('component choices', () => {
    expect(componentOptions(1)).toEqual([{ value: 'magnitude', label: 'Value' }])
    expect(componentOptions(3).map((option) => option.label)).toEqual(['Magnitude', 'X', 'Y', 'Z'])
  })
})

describe('field changes in the panel', () => {
  const delta = { min: -0.25, max: 0.5, mean: 0.111111, rms: 0.296586, changed: 20, count: 27 }

  it('summarises a delta', () => {
    expect(fieldDeltaSummary(delta, 'point')).toBe('-0.25 … +0.5, mean +0.1111, RMS 0.2966, 20 of 27 points changed')
  })

  it('formats field changes in the shared deltas table', () => {
    expect(formatValue([0, 7], 'range')).toBe('0 … 7')
    expect(formatValue(null, 'range')).toBe('–')
    expect(formatDelta({ attribute: 'field:p', a: [0, 7], b: [-0.25, 7.25], delta }, 'range')).toBe('-0.25 … +0.5')
  })
})

describe('how the diff draws a block', () => {
  const state = initialViewState()

  it('by class: the shared unified rules', () => {
    expect(simulationAppearance(entity('probe', 'added', 'b'), state, 'classes').b).toEqual({
      colour: diffColours.added,
      opacity: 1,
    })
    expect(simulationAppearance(entity('baffle', 'removed', 'a'), state, 'classes').a).toMatchObject({
      colour: diffColours.removed,
      opacity: 0.3,
    })
    const moved = simulationAppearance(entity('outlet', 'moved'), state, 'classes')
    expect(moved.b).toMatchObject({ colour: diffColours.moved, placement: 1 })
    expect(moved.line).toBe(true)
  })

  it('by a field of A or B: that revision only', () => {
    const inA = simulationAppearance(entity('inlet', 'unchanged'), state, 'a', same)
    expect(inA.a).toMatchObject({ colourBy: 'field' })
    expect(inA.b).toBeNull()
    expect(simulationAppearance(entity('probe', 'added', 'b'), state, 'a').a).toBeNull()
    expect(simulationAppearance(entity('probe', 'added', 'b'), state, 'b').b).toMatchObject({ colourBy: 'field' })
  })

  it('by B - A on blocks with the same cells; the others keep their class', () => {
    expect(simulationAppearance(entity('inlet', 'unchanged'), state, 'delta', same)).toEqual({
      a: null,
      b: { colour: diffColours.unchanged, opacity: 1, placement: 1, colourBy: 'delta' },
      line: false,
    })
    expect(simulationAppearance(entity('outlet', 'moved'), state, 'delta', same).b).toMatchObject({ colourBy: 'delta' })
    const body = simulationAppearance(entity('body', 'modified'), state, 'delta', different)
    expect(body.b).toMatchObject({ colour: diffColours.modified })
    expect(body.b && body.b.colourBy).toBeUndefined()
    expect(simulationAppearance(entity('probe', 'added', 'b'), state, 'delta').b).toMatchObject({
      colour: diffColours.added,
    })
  })
})

describe('the vtk.js serialisation', () => {
  it('reads an array from its little endian file, and refuses one of the wrong size', () => {
    const array = {
      vtkClass: 'vtkDataArray',
      name: 'p',
      numberOfComponents: 1,
      dataType: 'Float32Array' as const,
      size: 2,
      ref: { encode: 'LittleEndian' as const, basepath: 'data', id: 'field-0' },
    }
    expect(Array.from(parseArray(array, Float32Array.from([1.5, -2]).buffer))).toEqual([1.5, -2])
    expect(() => parseArray(array, Float32Array.from([1]).buffer)).toThrow('has 1 values, not 2')
  })
})
