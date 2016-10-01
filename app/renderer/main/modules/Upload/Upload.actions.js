import http from 'axios';

export function upload({cacheKey, files}) {
  let data = new FormData();
  files.forEach((file)=>data.append('file', file));

  return {
    type: 'UPLOAD/UPLOAD',
    payload: http({
      method: 'POST',
      url: `https://${process.env.API_SERVER}/api/v1/uploads`,
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
