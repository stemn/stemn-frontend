/**
 * The scene model of an open-source (OpenCascade) render, mirroring stemn-backend's `@stemn/types` render scene.
 * The converter writes it next to the glb (`outputs.scene`, served at
 * `GET /api/v1/sync/downloadRenderFile/{projectId}/{fileId}/{revisionId}/scene.json`); entity ids are the same ids the
 * glb carries in `node.extras.stemn.id`, so a later file-diff layer can match entities between revisions.
 */

export type IRenderSceneEntityKind = 'assembly' | 'part' | 'solid' | 'mesh'

export interface IRenderSceneEntity {
  /** Stable id, e.g. 'bracket-assembly/base-plate' or 'bracket-assembly/bolt#2' */
  id: string
  kind: IRenderSceneEntityKind
  /** Display label (product or instance name) */
  label: string
  parentId: string | null
  /** 4x4 column-major, glTF frame, metres */
  transform: number[]
  /** World bounds, glTF frame, metres */
  bounds: { min: number[]; max: number[] }
  geometryHash: string | null
  attributes: { [key: string]: any }
  /** The glb node that draws the entity, if any */
  payloadRef: { node: number } | null
}

export interface IRenderScene {
  version: 1
  converter: string
  units: { [key: string]: string }
  entities: IRenderSceneEntity[]
}

/** What the converter puts in a glTF node's `extras.stemn` (three's GLTFLoader copies it to `object.userData.stemn`) */
export interface IStemnNodeExtras {
  id: string
  kind: 'assembly' | 'part' | 'mesh'
  ocaf?: string
  shapePath?: string
  solids?: Array<{ path: string; signature: string; geometryHash: string }>
  geometryHash?: string
}

/** The outputs an open-source render records (render record `outputs`) */
export interface IRenderOutputs {
  model: string
  thumbnail: string
  scene?: string
  parts: Array<{ name: string; triangles: number }>
  triangles: number
  /** millimetres, z up */
  size: number[]
  converter: string
  /** milliseconds */
  duration: number
}
