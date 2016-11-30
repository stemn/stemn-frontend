export const formatBytes = (bytes, decimals) => {
   if(bytes == 0) return '0 Byte';
   var k = 1024; // or 1024 for binary
   var dm = decimals + 1 || 1;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const getDownloadUrl = (fileMeta) => {
  return fileMeta.project && fileMeta.project._id
  ? `${process.env.API_SERVER}/api/v1/sync/download/${fileMeta.project._id}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`
  : `${process.env.API_SERVER}/api/v1/remote/download/${fileMeta.provider}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`;
}

export const isDriveFileId = (id) => {
  return id && id.length == 28
}
export const isDropboxFileId = (id) => {
  return id && id.length == 25 && id.startsWith('id:');
}
