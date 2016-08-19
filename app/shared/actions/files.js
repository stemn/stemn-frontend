import http from 'axios';
export const GET_FILE = 'FILES/GET_FILE';
export const GET_META = 'FILES/GET_META';

export function getFile({projectStub, path}) {
  return {
    type: GET_FILE,
    http: true,
    payload: {
      method: 'GET',
      url: `https://stemn.com/api/v1/sync/download/${projectStub}/${path}`
    },
    meta: {
      cacheKey: `${projectStub}/${path}`
    }
  };
}

export function getMeta({projectStub, path}) {
  return {
    type: GET_META,
    http: true,
    payload: {
      method: 'GET',
      url: `https://stemn.com/api/v1/sync/metadata/${projectStub}/${path}`
    },
    meta: {
      cacheKey: `${projectStub}/${path}`
    }
  };
}
