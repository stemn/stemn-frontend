import { describe, expect, it } from 'vitest'
import type { Object3D } from 'three'
import {
  formatProperty,
  ifcOf,
  type IIfcProperties,
  isIfcManifest,
  propertyGroups,
  storeyOfEntity,
  storeysOf,
} from './ifc.utils'

// what the converter puts on a glTF node's extras.stemn.ifc
const node = (ifc: Partial<IIfcProperties> | null) =>
  ({ userData: ifc ? { stemn: { ifc } } : {} }) as unknown as Object3D

const window = (width: number): IIfcProperties => ({
  class: 'IfcWindow',
  globalId: '1WTSC_IlTGYwZRpQmhJb98',
  name: 'Window W1',
  material: 'Glazing',
  storey: 'Ground floor',
  overallWidth: width,
  psets: { Pset_WindowCommon: { IsExternal: true, ThermalTransmittance: 1.1 } },
  quantities: {},
})

const model = (entries: Array<[string, Partial<IIfcProperties> | null]>) => ({
  nodesById: new Map(entries.map(([id, ifc]) => [id, node(ifc)])),
})

describe('IFC models in the diff viewer', () => {
  it('knows an IFC diff by its adapter', () => {
    expect(isIfcManifest({ adapter: { name: 'aec', version: 1 } })).toBe(true)
    expect(isIfcManifest({ adapter: { name: 'cad', version: 1 } })).toBe(false)
    expect(isIfcManifest(null)).toBe(false)
  })

  it('lists the storeys of both revisions once, lowest first', () => {
    const a = model([
      ['s1', { class: 'IfcBuildingStorey', globalId: 's1', name: 'First floor', elevation: 3 }],
      ['s0', { class: 'IfcBuildingStorey', globalId: 's0', name: 'Ground floor', elevation: 0 }],
      ['w', window(1.2)],
    ])
    const b = model([['s0', { class: 'IfcBuildingStorey', globalId: 's0', name: 'Ground floor', elevation: 0 }]])
    expect(storeysOf([a, b, null])).toEqual([
      { name: 'Ground floor', elevation: 0 },
      { name: 'First floor', elevation: 3 },
    ])
  })

  it("puts an entity on B's storey, or A's when it was removed", () => {
    const a = model([['door', { class: 'IfcDoor', globalId: 'door', storey: 'Ground floor' }]])
    const b = model([['wall', { class: 'IfcWall', globalId: 'wall', storey: 'First floor' }]])
    expect(storeyOfEntity({ idA: 'door', idB: null }, a, b)).toBe('Ground floor')
    expect(storeyOfEntity({ idA: null, idB: 'wall' }, a, b)).toBe('First floor')
    expect(storeyOfEntity({ idA: null, idB: 'nothing' }, a, b)).toBeNull()
    expect(ifcOf(node(null))).toBeNull()
  })

  it('groups the attributes, property sets and quantities, and marks what changed from A', () => {
    const groups = propertyGroups(window(1.6), window(1.2))
    expect(groups.map((group) => group.name)).toEqual(['Attributes', 'Pset_WindowCommon'])
    const width = groups[0].properties.find((property) => property.name === 'Overall width')!
    expect(width).toEqual({ name: 'Overall width', value: 1.6, previous: 1.2, changed: true })
    expect(groups[1].properties.every((property) => !property.changed)).toBe(true)
    expect(propertyGroups(window(1.2))[0].properties.every((property) => !property.changed)).toBe(true)
  })

  it('formats property values', () => {
    expect([true, false, null, 1.1000000001, [1, 2], 'REI60', { a: 1 }].map(formatProperty)).toEqual([
      'Yes',
      'No',
      '–',
      '1.1',
      '1, 2',
      'REI60',
      '{"a":1}',
    ])
  })
})
