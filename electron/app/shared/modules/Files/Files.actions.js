import http from 'axios';
import { has } from 'lodash';
import { name as localPathModuleName} from '../LocalPath/LocalPath.reducer.js';
import * as LocalPathActions          from '../LocalPath/LocalPath.actions.js';
import * as FilesUtils                from './Files.utils.js'

//export function getFile({projectId, fileId, revisionId, provider, responseType}) {
//  return (dispatch) => {
//    const cacheKey = `${fileId}-${revisionId}`
//    return dispatch({
//      type: 'FILES/GET_FILE',
//      http: true,
//      payload: {
//        method: 'GET',
//        url: projectId ? `/api/v1/sync/download/${projectId}/${fileId}` : `/api/v1/remote/download/${provider}/${fileId}`,
//        params: {
//          revisionId
//        },
//        responseType: responseType || 'json',
////        onDownloadProgress: function (progressEvent) {
////          const percentage = progressEvent.loaded / progressEvent.total;
////          dispatch(getFileProgress({percentage, cacheKey}));
////        },
//      },
//      meta: {
//        cacheKey
//      }
//    })
//  }
//}

export function getFile({projectId, fileId, revisionId, provider, responseType}) {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_FILE',
    aliased: true,
    payload: {
      functionAlias: 'FileCache.get',
      functionInputs: {
        key          : cacheKey,
        url          : projectId
                       ? `/api/v1/sync/download/${projectId}/${fileId}`
                       : `/api/v1/remote/download/${provider}/${fileId}`,
        params       : { revisionId },
        name         : cacheKey,
        responseType : responseType || 'json'
      }
    },
    meta: {
      cacheKey
    }
  }
}

export function getFileProgress({percentage, cacheKey}) {
  return {
    type: 'FILES/GET_FILE_PROGRESS',
    payload: {
      percentage
    },
    meta: {
      cacheKey,
    }
  }
}

export function renderFile({projectId, fileId, revisionId, provider}) {
  const cacheKey = `${fileId}-${revisionId}`;
  return {
    type: 'FILES/RENDER_FILE',
    aliased: true,
    payload: {
      functionAlias: 'FileCache.get',
      functionInputs: {
        key          : cacheKey,
        renderUrl    : projectId
                       ? `/api/v1/sync/render/${projectId}/${fileId}`
                       : `/api/v1/remote/render/${provider}/${fileId}`,
        url          : projectId
                       ? `/api/v1/sync/downloadRender/${projectId}/${fileId}`
                       : `/api/v1/remote/downloadRender/${provider}/${fileId}`,
        params       : { revisionId },
        name         : cacheKey,
        responseType : 'path',
        extract      : true
      }
    },
    meta: {
      cacheKey
    }
  };
}

export function renderFileDownload({projectId, fileId, revisionId, provider}) {
  const cacheKey = `${fileId}-${revisionId}`;
  return {
    type: 'FILES/RENDER_FILE_DOWNLOAD',
    aliased: true,
    payload: {
      functionAlias: 'FileCache.get',
      functionInputs: {
        key          : cacheKey,
        url          : projectId
                       ? `/api/v1/sync/downloadRender/${projectId}/${fileId}`
                       : `/api/v1/remote/downloadRender/${provider}/${fileId}`,
        params       : { revisionId },
        name         : cacheKey,
        responseType : 'path',
        extract      : true
      }
    },
    meta: {
      cacheKey,
    }
  };
}

export function getAssemblyParts({projectId, fileId, revisionId, provider}) {
  const cacheKey = `${fileId}-${revisionId}`;
  return {
    type: 'FILES/GET_ASSEMBLY_PARTS',
    payload: http({
      url    : projectId
             ? `/api/v1/sync/assemblyParts/${projectId}/${fileId}`
             : `/api/v1/remote/assemblyParts/${provider}/${fileId}`,
      params : { revisionId },
    }),
    meta: {
      cacheKey,
      fileId,
      revisionId
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
        dispatch(LocalPathActions.getPath({provider, projectId})).then(response => {
          const completePath = computerToProvider + addSlash(response.value.data) + addSlash(projectToFile);
          resolve(normaliseSlashes(completePath))
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

export function websocketJoinFile({fileId}) {
  return (dispatch, getState) => {
    const alreadyConnected = getState().files.websocketRooms.includes(fileId);
    if(!alreadyConnected){
      dispatch({
        type: 'FILES/WEBSOCKET_JOIN_FILE',
        websocket: true,
        payload: {
          type : 'ROOM/JOIN',
          payload : {
            room : fileId,
            type : 'file'
          }
        }
      });
    }
  }
}

export function websocketLeaveFile({fileId}) {
  return (dispatch, getState) => {
    const alreadyConnected = getState().files.websocketRooms.includes(fileId);
    if(alreadyConnected){
      dispatch({
        type: 'FILES/WEBSOCKET_LEAVE_FILE',
        websocket: true,
        payload: {
          type : 'ROOM/LEAVE',
          payload : {
            room : fileId,
            type : 'file'
          }
        }
      });
    }
  }
}
