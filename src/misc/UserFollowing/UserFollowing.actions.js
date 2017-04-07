export const getUserFollowing = ({ userId, page = 1, size }) => ({
  type: 'USER_FOLLOWING/GET_FOLLOWING',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/users/${userId}/following`,
    params: {
      type: 'user',
      size,
      page,
    }
  },
  meta: {
    userId,
    page
  }
})
