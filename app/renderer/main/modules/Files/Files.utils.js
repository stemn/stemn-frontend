import { remote } from 'electron'
import http       from 'http';
import fs         from 'fs';

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
  return id && !id.startsWith('id:');
}
export const isDropboxFileId = (id) => {
  return id && id.startsWith('id:');
}

export const saveFile = ({fileUrl, filePath, onProgress}) => {
  const getDestination = (defaultPath) => {
    return new Promise((resolve, reject) => {
      remote.dialog.showSaveDialog({
        defaultPath : defaultPath,
      }, (file) => {
        if(file){resolve(file)}
        else{reject(false)}
      });
    })
  }

  const downloadAndSave = ({url, dest, onProgress}) => {
    return new Promise((resolve, reject) => {
      http.get(url, (request) => {
        const file       = fs.createWriteStream(dest);
        const total      = request.headers['content-length'];
        let progress     = 0;
        let progressPerc = 0;
        request.on('data', function (chunk) {
          progress    += chunk.length;
          progressPerc = parseInt((progress / total) * 100);
          if(onProgress){onProgress(progressPerc)}
        });
        request.pipe(file);
        file.on('finish', (response) => {
          resolve()
        });
      }).on('error', (response) => {
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        reject(response)
      });
    })
  };

  return getDestination(filePath).
  then(destination => {
    return downloadAndSave({
      url: fileUrl,
      dest: destination,
      onProgress: onProgress
    })
  }).
  catch(error => error)
}
