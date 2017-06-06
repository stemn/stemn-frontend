export const getUserStars = ({ userId, page = 1, size }) => ({
  type: 'USER_STARS/GET_STARS',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/users/${userId}/likes`,
    params: {
      type: 'user',
      page,
      size,
    }
  },
  meta: {
    userId,
    page,
  }
})
