import http from 'axios'

export default (email: string) => ({
  type: 'AUTH/UPDATE_EMAIL' as const,
  payload: http({
    url: '/api/v1/auth/primary-mail',
    method: 'POST',
    data: {
      email,
    },
  }),
})
