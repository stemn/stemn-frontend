/**
 * IFC models (the diff adapter `aec`): the backend's converter (IfcOpenShell) puts every product's attributes, property
 * sets and quantities on its glTF node, `extras.stemn.ifc` (three's GLTFLoader copies it to `userData.stemn.ifc`), and
 * the spatial structure (site, building, storeys, spaces) as parent nodes. These helpers read them for the property panel
 * and the storey filter. No three.js values here, only its types.
 */
import type { Object3D } from 'three'
import type { IDiffEntity, IDiffManifest } from '../diff.types'

export interface IIfcProperties {
  class: string
  globalId: string
  name?: string
  type?: string
  predefinedType?: string
  objectType?: string
  material?: string
  storey?: string
  elevation?: number
  psets: { [pset: string]: { [property: string]: any } }
  quantities: { [qto: string]: { [quantity: string]: any } }
  [attribute: string]: any
}

export interface IIfcStorey {
  name: string
  elevation: number
}

interface IModelNodes {
  nodesById: Map<string, Object3D>
}

/** Whether a manifest is the diff of an IFC model */
export const isIfcManifest = (manifest: Pick<IDiffManifest, 'adapter'> | null) =>
  Boolean(manifest && manifest.adapter.name === 'aec')

/** The IFC attributes the converter put on a node, or null */
export const ifcOf = (node: Object3D | null | undefined): IIfcProperties | null =>
  (node && node.userData && node.userData.stemn && node.userData.stemn.ifc) || null

/** The storeys of the models, lowest first */
export const storeysOf = (models: Array<IModelNodes | null | undefined>): IIfcStorey[] => {
  const storeys = new Map<string, IIfcStorey>()
  models.forEach((model) => {
    if (!model) return
    model.nodesById.forEach((node) => {
      const ifc = ifcOf(node)
      if (ifc && ifc.class === 'IfcBuildingStorey' && !storeys.has(ifc.name || ifc.globalId)) {
        storeys.set(ifc.name || ifc.globalId, { name: ifc.name || ifc.globalId, elevation: Number(ifc.elevation) || 0 })
      }
    })
  })
  return [...storeys.values()].sort((x, y) => x.elevation - y.elevation || x.name.localeCompare(y.name))
}

/** The storey an entity is on: B's, or A's for removed entities */
export const storeyOfEntity = (
  entity: Pick<IDiffEntity, 'idA' | 'idB'>,
  modelA: IModelNodes | null | undefined,
  modelB: IModelNodes | null | undefined,
) => {
  const node =
    (entity.idB && modelB && modelB.nodesById.get(entity.idB)) ||
    (entity.idA && modelA && modelA.nodesById.get(entity.idA))
  const ifc = ifcOf(node || null)
  return (ifc && ifc.storey) || null
}

/** The attributes the panel lists above the property sets, in order */
const attributeNames: Array<[string, string]> = [
  ['class', 'Class'],
  ['globalId', 'GlobalId'],
  ['name', 'Name'],
  ['type', 'Type'],
  ['predefinedType', 'Predefined type'],
  ['objectType', 'Object type'],
  ['material', 'Material'],
  ['storey', 'Storey'],
  ['tag', 'Tag'],
  ['overallWidth', 'Overall width'],
  ['overallHeight', 'Overall height'],
  ['description', 'Description'],
]

export interface IIfcPropertyGroup {
  name: string
  properties: Array<{ name: string; value: any; previous?: any; changed: boolean }>
}

const same = (x: any, y: any) => JSON.stringify(x) === JSON.stringify(y)

/**
 * The property panel's groups: the product's attributes, then each property set and quantity set. With a `previous`
 * (A's properties for an entity of both revisions), every property says whether it changed and what it was.
 */
export const propertyGroups = (ifc: IIfcProperties, previous?: IIfcProperties | null): IIfcPropertyGroup[] => {
  const row = (name: string, value: any, before: any) =>
    previous ? { name, value, previous: before, changed: !same(value, before) } : { name, value, changed: false }
  const sets = (key: 'psets' | 'quantities') =>
    Object.keys({ ...(ifc[key] || {}), ...(previous ? previous[key] || {} : {}) })
      .sort()
      .map((set) => {
        const now = (ifc[key] || {})[set] || {}
        const before = previous ? (previous[key] || {})[set] || {} : {}
        return {
          name: set,
          properties: Object.keys({ ...now, ...before })
            .sort()
            .map((property) => row(property, now[property], before[property])),
        }
      })
  return [
    {
      name: 'Attributes',
      properties: attributeNames
        .filter(([key]) => ifc[key] !== undefined || (previous && previous[key] !== undefined))
        .map(([key, label]) => row(label, ifc[key], previous ? previous[key] : undefined)),
    },
    ...sets('psets'),
    ...sets('quantities'),
  ]
}

/** A property value for the panel */
export const formatProperty = (value: any) => {
  if (value === null || value === undefined) return '–'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return String(Number(value.toPrecision(6)))
  if (Array.isArray(value)) return value.map(formatProperty).join(', ')
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}
