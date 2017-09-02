export default fileMeta => (fileMeta.project && fileMeta.project._id
  ? `${GLOBAL_ENV.API_SERVER}/api/v1/sync/download/${fileMeta.project._id}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`
  : `${GLOBAL_ENV.API_SERVER}/api/v1/remote/download/${fileMeta.provider}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`)
