export default ({ projectId, fileId }) => {
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