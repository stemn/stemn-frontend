import http from 'axios';
export const GET_FILE = 'FILES/GET_FILE';
export const GET_META = 'FILES/GET_META';

export function getFile({projectId, fileId, revisionId}) {
  return {
    type: GET_FILE,
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/remote/download/${projectId}/${fileId}?revisionId=${revisionId}`
    },
    meta: {
      cacheKey: `${projectId}-${fileId}-${revisionId}`
    }
  };
}

export function getMeta({projectId, fileId, revisionId}) {
  return {
    type: GET_META,
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/metadata/${projectId}/${fileId}`
    },
    meta: {
      cacheKey: `${projectId}-${fileId}-${revisionId}`
    }
  };
}
