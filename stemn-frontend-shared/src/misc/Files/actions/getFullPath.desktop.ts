import { has } from 'lodash'
import { getPath } from 'stemn-shared/desktop/LocalPath/LocalPath.actions.js'
import { name as localPathModuleName } from 'stemn-shared/desktop/LocalPath/LocalPath.reducer.js'
import { normaliseSlashes } from 'stemn-shared/desktop/System/System.utils'

export const getFullPath = ({ path, projectId, provider }) => (dispatch, getState) => {
  const storeState = getState()
  const addSlash = (p) => (p && p[0] !== '/' && p[0] !== '\\' ? `/${p}` : p)
  return new Promise((resolve, reject) => {
    const computerToProvider = storeState.system.providerPath[provider]
    const projectToFile = path
    if (has(storeState, [localPathModuleName, projectId, 'data'])) {
      const completePath = computerToProvider + addSlash(storeState[localPathModuleName][projectId].data) + addSlash(projectToFile)
      resolve(normaliseSlashes(completePath))
    } else {
      dispatch(getPath({ provider, projectId })).then((response) => {
        const completePath = computerToProvider + addSlash(response.value.data) + addSlash(projectToFile)
        resolve(normaliseSlashes(completePath))
      }).catch(reject)
    }
  })
}
