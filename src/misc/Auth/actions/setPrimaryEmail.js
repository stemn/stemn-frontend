import http from 'axios'

export default email => ({
  type: 'AUTH/UPDATE_EMAIL',
  payload: http({
    url: '/api/v1/auth/primaryEmail',
    method: 'POST',
    data: {
      email,
    },
  }),
})
