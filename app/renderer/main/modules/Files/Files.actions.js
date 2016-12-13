import http from 'axios';
import { has } from 'lodash';
import { name as localPathModuleName} from '../../../../shared/modules/LocalPath/LocalPath.reducer.js';
import * as LocalPathActions          from '../../../../shared/modules/LocalPath/LocalPath.actions.js';
import * as FilesUtils                from './Files.utils.js'

export function getFile({projectId, fileId, revisionId, provider}) {
  return {
    type: 'FILES/GET_FILE',
    http: true,
    payload: {
      method: 'GET',
      url: projectId ? `/api/v1/sync/download/${projectId}/${fileId}` : `/api/v1/remote/download/${provider}/${fileId}`,
      params: {
        revisionId
      }
    },
    meta: {
      cacheKey: `${fileId}-${revisionId}`
    }
  };
}

export function renderFile({projectId, fileId, revisionId, provider}) {
  return {
    type: 'FILES/RENDER_FILE',
    payload: http({
      method: 'GET',
      url: projectId
      ? `/api/v1/sync/render/${projectId}/${fileId}`
      : `/api/v1/remote/render/${provider}/${fileId}`,
      params: {
        revisionId
      }
    }),
    meta: {
      cacheKey: `${fileId}-${revisionId}`
    }
  };
}

export function getMeta({projectId, fileId, revisionId, provider}) {
  return {
    type: 'FILES/GET_META',
    http: true,
    payload: {
      method: 'GET',
      url: projectId ? `/api/v1/sync/files/${projectId}/${fileId}` : `/api/v1/remote/files/${provider}/${fileId}`,
      params: {
        revisionId
      }
    },
    meta: {
      cacheKey: `${fileId}-${revisionId}`
    }
  };
}

export function getMetaFromPath({ path }) {
  return (dispatch, getState) => {
    const providerPaths = getState().system.providerPath;
    const provider = Object.keys(providerPaths).find(provider => path.startsWith(providerPaths[provider]));
    const shortPath = path.replace(providerPaths[provider], '').replace('\\', '/');
    const pathNoSlash = shortPath[0] == '/' ? shortPath.substring(1) : shortPath;
    if(provider && shortPath){
      dispatch({
        type: 'FILES/GET_META_FROM_PATH',
        http: true,
        payload: {
          method: 'GET',
          url: `/api/v1/remote/pathToId/${provider}/${pathNoSlash}`,
        },
        meta: {
          cacheKey: path
        }
      })
    }
  }
}

export function getRelatedTasks({ projectId, fileId }) {
  return {
    type: 'FILES/GET_RELATED_TASKS',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/sync/files/${projectId}/${fileId}/tasks`,
    },
    meta: {
      fileId
    }
  }
}

export function getFullPath({ path, projectId, provider }) {
  return (dispatch, getState) => {
    const storeState = getState();
    const addSlash = (path) => {
      return path && path[0] != '/' && path[0] != '\\' ? '/' + path : path
    }
    const normaliseSlashes = (path) => {
      return path.replace('/', '\\')
    }
    return new Promise((resolve, reject) => {
      const computerToProvider = storeState.system.providerPath[provider];
      const projectToFile      = path;

      if(has(storeState, [localPathModuleName, projectId, 'data'])){
        const fullPath = computerToProvider + addSlash(storeState[localPathModuleName][projectId].data) + addSlash(projectToFile);
        resolve(normaliseSlashes(fullPath))
      }
      else{
        dispatch(LocalPathActions.getPath({provider, projectId})).then(response => {
          const fullpath = computerToProvider + addSlash(response.value.data) + addSlash(projectToFile);
          resolve(normaliseSlashes(fullPath))
        }).catch(reject)
      }
    })
  }
}

export function saveFile({fileUrl, filePath}) {
  return (dispatch, getState) => {
    dispatch(downloadProgress(fileUrl, 0))
    FilesUtils.saveFile({
      fileUrl,
      filePath,
      onProgress: (progress) => {
        dispatch(downloadProgress(fileUrl, progress))
      }
    })
  }
}

export function downloadProgress(cacheKey, progress) {
  return {
    type: 'FILES/DOWNLOAD_PROGRESS',
    payload: {
      progress,
      cacheKey
    }
  }
}
