import http from 'axios';

export function getFile({projectId, fileId, revisionId}) {
  return {
    type: 'FILES/GET_FILE',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/sync/download/${projectId}/${fileId}`,
      params: {
        revisionId
      }
    },
    meta: {
      cacheKey: `${projectId}-${fileId}-${revisionId}`
    }
  };
}

export function getMeta({projectId, fileId, revisionId}) {
  return {
    type: 'FILES/GET_META',
//    http: true,
    payload: http({
      method: 'GET',
      url: `/api/v1/sync/files/${projectId}/${fileId}`,
      params: {
        revisionId
      }
    }),
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
