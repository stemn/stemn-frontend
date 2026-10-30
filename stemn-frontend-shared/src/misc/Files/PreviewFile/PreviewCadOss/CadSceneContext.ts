import { createContext } from 'react'
import type { Object3D } from 'three'

/** The loaded model and its nodes by stable id (see nodesFromScene): what a file-diff layer needs to colour or ghost entities */
export interface ICadSceneReady {
  root: Object3D
  nodesById: Map<string, Object3D>
}

/** Provided by PreviewCadOss once the model has loaded (null while loading) */
export const CadSceneContext = createContext<ICadSceneReady | null>(null)
