export default (fileMeta) => {
  return fileMeta.project && fileMeta.project._id
  ? `${process.env.API_SERVER}/api/v1/sync/download/${fileMeta.project._id}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`
  : `${process.env.API_SERVER}/api/v1/remote/download/${fileMeta.provider}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`;
}
