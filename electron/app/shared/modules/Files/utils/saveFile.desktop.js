import { remote } from 'electron'
import http       from 'axios';
import fs         from 'fs';

export default ({fileUrl, filePath, onProgress}) => {
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
      http({
        url: url,
        responseType: 'stream'
      }).then(response => {
        const stream     = response.data;
        const file       = fs.createWriteStream(dest);
        const total      = response.headers['content-length'];
        let progress     = 0;
        let progressPerc = 0;
        stream.on('data', chunk => {
          progress    += chunk.length;
          progressPerc = parseInt((progress / total) * 100);
          if(onProgress){onProgress(progressPerc)}
        });
        stream.on('error', response => {
          fs.unlink(dest); // Delete the file async. (But we don't check the result)
          reject(response)
        });
        stream.on('end', response => {
          resolve({size: total})
        });
        stream.pipe(file);
      })
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
