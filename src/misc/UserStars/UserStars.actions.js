export const getUserStars = ({ userId }) => ({
  type: 'USER_STARS/GET_STARS',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/users/${userId}/likes`,
    params: {
      type: 'user'
    }
  },
  meta: {
    userId
  }
})
