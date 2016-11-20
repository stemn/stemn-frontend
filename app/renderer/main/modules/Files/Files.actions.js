import http from 'axios';
export const GET_FILE = 'FILES/GET_FILE';
export const GET_META = 'FILES/GET_META';

export function getFile({projectId, fileId, revisionId}) {
  return {
    type: GET_FILE,
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/remote/download/${projectId}/${fileId}`,
      params: {
        revisionId
      }
    },
    meta: {
      cacheKey: `${projectId}-${fileId}-${revisionId}`
    }
  };
}

export function getMeta({fileId, revisionId}) {
  return {
    type: GET_META,
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/files/${fileId}`,
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
