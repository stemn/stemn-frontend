import http from 'axios';

export function init({cacheKey, files}) {
  return {
    type: 'UPLOAD/INIT',
    payload: {
      cacheKey,
      files
    },
  };
}

export function upload({cacheKey, files}) {
  // Create the data object
  let data = new FormData();
  files.forEach((file)=>data.append('file', file));
  // Submit it
  return {
    type: 'UPLOAD/UPLOAD',
    payload: http({
      method: 'POST',
      url: `/api/v1/uploads`,
      data: data,
      progressUpload: function(progressEvent) {
        var percentCompleted = progressEvent.loaded / progressEvent.total;
        console.log(percentCompleted);
      }
    }),
    meta: {
      cacheKey,
      files
    }
  };
}
