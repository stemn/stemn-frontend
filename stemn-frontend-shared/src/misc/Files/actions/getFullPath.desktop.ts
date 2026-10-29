import { has } from 'lodash'
import { getPath } from 'stemn-shared/desktop/LocalPath/LocalPath.actions.js'
import { name as localPathModuleName } from 'stemn-shared/desktop/LocalPath/LocalPath.reducer.js'
import { normaliseSlashes } from 'stemn-shared/desktop/System/normaliseSlashes'
import type { IPromiseResult, StemnThunk } from 'stemn-shared/redux/types'
import type { FileProvider } from './types'

/** The desktop slices getFullPath reads (System and LocalPath reducers, not converted yet) */
export interface IDesktopPathState {
  system: { providerPath: { [provider: string]: string } }
  localPath: { [projectId: string]: { data?: string } }
}

/** The absolute local path of a project file: provider folder + project folder + path in the project */
export const getFullPath =
  ({
    path,
    projectId,
    provider,
  }: {
    path: string
    projectId: string
    provider: FileProvider
  }): StemnThunk<Promise<string>, IDesktopPathState> =>
  (dispatch, getState) => {
    const storeState = getState()
    const addSlash = (p: string | undefined) => (p && p[0] !== '/' && p[0] !== '\\' ? `/${p}` : p)
    return new Promise((resolve, reject) => {
      const computerToProvider = storeState.system.providerPath[provider]
      const projectToFile = path
      if (has(storeState, [localPathModuleName, projectId, 'data'])) {
        const completePath =
          computerToProvider + addSlash(storeState[localPathModuleName][projectId].data) + addSlash(projectToFile)
        resolve(normaliseSlashes(completePath))
      } else {
        dispatch(getPath({ projectId }))
          .then((response: IPromiseResult<{ data: string }>) => {
            const completePath = computerToProvider + addSlash(response.value.data) + addSlash(projectToFile)
            resolve(normaliseSlashes(completePath))
          })
          .catch(reject)
      }
    })
  }
