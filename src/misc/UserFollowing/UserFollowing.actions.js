export const getUserFollowing = ({ userId }) => ({
  type: 'USER_FOLLOWING/GET_FOLLOWING',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/users/${userId}/follows`,
    params: {
      type: 'user'
    }
  },
  meta: {
    userId
  }
})
