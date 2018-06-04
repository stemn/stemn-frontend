import http from 'axios'

export default provider => ({
  type: 'AUTH/UNLINK',
  payload: http({
    url: `/api/v1/auth/unlink/${provider}`,
    method: 'POST',
  }),
})