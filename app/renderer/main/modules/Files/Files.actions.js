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
