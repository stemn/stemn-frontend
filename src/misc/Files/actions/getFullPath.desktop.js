import { has } from 'lodash';
import { name as localPathModuleName } from 'stemn-shared/desktop/LocalPath/LocalPath.reducer.js';
import { getPath }           from 'stemn-shared/desktop/LocalPath/LocalPath.actions.js';

export default ({ path, projectId, provider }) => {
  return (dispatch, getState) => {
    const storeState = getState();
    const addSlash = (path) => {
      return path && path[0] != '/' && path[0] != '\\' ? '/' + path : path
    }
    return new Promise((resolve, reject) => {
      const computerToProvider = storeState.system.providerPath[provider];
      const projectToFile      = path;
      const normaliseSlashes = (path) => {
        return path.replace('/', '\\')
      }
      if(has(storeState, [localPathModuleName, projectId, 'data'])){
        const completePath = computerToProvider + addSlash(storeState[localPathModuleName][projectId].data) + addSlash(projectToFile);
        resolve(normaliseSlashes(completePath))
      }
      else{
        dispatch(getPath({provider, projectId})).then(response => {
          const completePath = computerToProvider + addSlash(response.value.data) + addSlash(projectToFile);
          resolve(normaliseSlashes(completePath))
        }).catch(reject)
      }
    })
  }
}
