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
  return (dispatch) => {
    // Create the data object
    let data = new FormData();
    files.forEach((file)=>data.append('file', file));

    // Submit it
    return dispatch({
      type: 'UPLOAD/UPLOAD',
      payload: http({
        method: 'POST',
        url: `/api/v1/uploads`,
        data: data,
        onUploadProgress: function(progressEvent) {
          var percentage = progressEvent.loaded / progressEvent.total;
          dispatch(progress({percentage, cacheKey}));
        }
      }),
      meta: {
        cacheKey,
        files
      }
    })
  }
}

export function progress({percentage, cacheKey}) {
  return {
    type: 'UPLOAD/PROGRESS',
    payload: {
      percentage
    },
    meta: {
      cacheKey,
    }
  }
}
