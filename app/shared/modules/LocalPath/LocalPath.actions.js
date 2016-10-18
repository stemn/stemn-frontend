export function getPath({projectId}) {
  return {
    type: 'LOCAL_PATH/GET_PATH',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/remote/localPath/${projectId}`
    },
    meta: {
      projectId
    }
  }
}
