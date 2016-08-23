import http from 'axios';
export const GET_FILE = 'FILES/GET_FILE';
export const GET_META = 'FILES/GET_META';

export function getFile({projectId, fileId}) {
  return {
    type: GET_FILE,
    http: true,
    payload: {
      method: 'GET',
      url: `https://stemn.com/api/v1/sync/download/${projectId}/${fileId}`
    },
    meta: {
      cacheKey: `${projectId}/${fileId}`
    }
  };
}

export function getMeta({projectId, fileId}) {
  return {
    type: GET_META,
    http: true,
    payload: {
      method: 'GET',
      url: `https://stemn.com/api/v1/sync/metadata/${projectId}/${fileId}`
    },
    meta: {
      cacheKey: `${projectId}/${fileId}`
    }
  };
}
