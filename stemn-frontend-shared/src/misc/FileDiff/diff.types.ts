/**
 * The diff contract with stemn-backend, mirroring its `@stemn/types` (libraries/types/src/models/diff.ts):
 * the canonical scene model every adapter turns a file type into, and the manifest
 * `GET /api/v1/sync/diff/{projectId}/{fileId}/{revisionA}/{revisionB}` returns. See docs/DIFF-VIEWERS.md.
 */

/** How an entity changed from revision A (older) to revision B (newer) */
export type IDiffClass = 'unchanged' | 'added' | 'removed' | 'modified' | 'moved'

/** How the engine paired an entity of A with one of B: same id, instance group (bolt#1/bolt#2), or shape + position */
export type IDiffMatchMethod = 'id' | 'instance' | 'signature'

/** One entity of a scene, in the adapter's terms (part, mesh, footprint, net, IfcWall, layer, ...) */
export interface ISceneEntity {
  /** Stable across revisions where the format allows: 'bracket-assembly/bolt#2', a uuid, a handle */
  id: string
  kind: string
  label: string
  parentId: string | null
  /** 4x4, column major, world frame */
  transform: number[] | null
  /** World bounds */
  bounds: { min: number[]; max: number[] } | null
  /** Hash of the geometry in the entity's own frame (unchanged by moves) */
  geometryHash: string | null
  /** Named numbers for matching entities whose ids changed (volume, area, faces, extents, ...) */
  signature: { [name: string]: number | number[] } | null
  attributes: { [key: string]: any }
  /** Where the viewer finds the entity in the revision's render, e.g. `{ node: 3 }` for a glTF node */
  payloadRef: { [key: string]: any } | null
}

export interface IDiffAdapterVersion {
  name: string
  version: number
}

export interface IScene {
  version: 1
  adapter: IDiffAdapterVersion
  units: { [key: string]: string }
  entities: ISceneEntity[]
}

export interface IDiffAttributeDelta {
  attribute: string
  a: any
  b: any
  /** b - a for numbers (per component for number arrays) */
  delta?: number | number[]
}

export interface IDiffMove {
  /** World translation of the bounds centre, in the scene's length unit */
  translation: number[]
  distance: number
  /** Degrees */
  rotation: number
}

export interface IDiffEntity {
  /** The id in B, or in A for removed entities */
  id: string
  idA: string | null
  idB: string | null
  kind: string
  label: string
  parentId: string | null
  class: IDiffClass
  match: { method: IDiffMatchMethod | null; confidence: number }
  /** The attributes that differ (modified entities) */
  changes: IDiffAttributeDelta[]
  /** B's placement relative to A's (moved, and modified entities that also moved) */
  move: IDiffMove | null
  centreA: number[] | null
  centreB: number[] | null
  payloadRefA: { [key: string]: any } | null
  payloadRefB: { [key: string]: any } | null
}

export type IDiffCounts = Record<IDiffClass, number>

export interface IDiffManifest {
  status: 'complete'
  version: 1
  adapter: IDiffAdapterVersion
  fileId: string
  revisionA: string
  revisionB: string
  units: { [key: string]: string }
  counts: IDiffCounts
  entities: IDiffEntity[]
  created: string
  duration: number
}

export interface IDiffPending {
  status: 'pending'
}

/** A failed diff request: the API's StemnError (`DIFF_NOT_SUPPORTED`, `DIFF_FAILED`, `REVISION_NOT_FOUND`, ...) */
export interface IDiffError {
  code?: number
  type: string
  message: string
  data?: any
}

/** The websocket events the API sends when a pending diff finishes */
export interface IDiffCompleteEvent {
  fileId: string
  revisionA: string
  revisionB: string
  adapter: IDiffAdapterVersion
  counts: IDiffCounts
}

export interface IDiffFailedEvent {
  fileId: string
  revisionA: string
  revisionB: string
  error: IDiffError
}
