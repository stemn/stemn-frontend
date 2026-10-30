/**
 * What the backend's converter writes for a simulation result (a `vtk` render, stemn-backend
 * services/cad-converter/README.md "Simulation results"): the scene model (`scene.json`, one entity per block, region or
 * mesh) and each block's surface in the vtk.js serialisation (`blocks/<b>/index.json` and its `data/` arrays).
 */
import type { ISceneEntity } from '../../../FileDiff/diff.types'

export type IFieldAssociation = 'point' | 'cell'

export interface ISimulationFieldRef {
  name: string
  association: IFieldAssociation
  components: number
}

export interface ISimulationEntity extends ISceneEntity {
  attributes: {
    cells: number
    points: number
    area?: number
    volume?: number
    size?: number[]
    fields?: Record<string, { association: IFieldAssociation; components: number; range: number[] | null }>
    [key: string]: any
  }
  payloadRef: {
    /** The block's directory in the render's zip */
    block: number
    /** A hash of the block's cells: equal in two revisions when their fields line up value by value */
    topology: string
    /** The block's fields, in the order of its `field-<n>` arrays */
    fields: ISimulationFieldRef[]
    surface: { points: number; cells: number }
  }
}

export interface ISimulationScene {
  version: 1
  converter: string
  units: Record<string, string>
  entities: ISimulationEntity[]
}

/** One array of a dataset in the vtk.js serialisation: its values are the file `data/<ref.id>` */
export interface IVtkJsArray {
  vtkClass: string
  name: string
  numberOfComponents: number
  dataType: 'Float32Array' | 'Uint32Array'
  size: number
  ref: { encode: 'LittleEndian'; basepath: string; id: string }
}

export interface IVtkJsDataset {
  vtkClass: 'vtkPolyData'
  metadata?: { name?: string }
  points: IVtkJsArray
  verts?: IVtkJsArray
  lines?: IVtkJsArray
  polys?: IVtkJsArray
  strips?: IVtkJsArray
  pointData: { arrays: Array<{ data: IVtkJsArray }> }
  cellData: { arrays: Array<{ data: IVtkJsArray }> }
}

export type ICellKind = 'verts' | 'lines' | 'polys' | 'strips'

/** A block's surface, ready for vtk.js: points and legacy cell arrays (n, id, id, ..., n, ...) */
export interface ISimulationGeometry {
  points: Float32Array
  cells: Partial<Record<ICellKind, Uint32Array>>
  /** The field arrays of the surface by name, fetched when first shown */
  fieldArrays: Record<string, IVtkJsArray>
}

/** A clipping plane across everything drawn: the side below the fraction (0-1 along the axis) stays */
export interface IClip {
  axis: 0 | 1 | 2
  fraction: number
}

/** Values to colour a block by: one number per point or cell */
export interface ISimulationScalars {
  association: IFieldAssociation
  values: Float32Array
}
