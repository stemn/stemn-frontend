import http from 'axios';


export function fetchFiles({projectId, path}) {
  return {
    type: 'FILE_SELECT/FETCH_FILES',
    payload: http({
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/listFolder/${projectId}/${path}`
    }),
    meta: {
     key: `${projectId}/${path}`
    }
  };
}
