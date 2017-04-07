export const getUserFollowers = ({ userId, size, page = 1 }) => ({
  type: 'USER_FOLLOWERS/GET_FOLLOWERS',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/users/${userId}/follows`,
    params: {
      type: 'user',
      size,
      page
    }
  },
  meta: {
    userId,
    page
  }
})
