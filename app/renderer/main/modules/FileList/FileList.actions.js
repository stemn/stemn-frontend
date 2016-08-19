export function fetchFiles({projectId, path, options}) {
  return {
    type: 'FILE_LIST/FETCH_FILES',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/listFolder/${projectId}/${path}`
    },
    meta: {
      key: `${projectId}/${path}`,
    }
  };
}
