import http from 'axios';

export default (provider) => {
  return {
    type:'AUTH/UNLINK',
    payload: http({
      url: `/api/v1/auth/unlink/${provider}`,
      method: 'POST',
    })
  }
}