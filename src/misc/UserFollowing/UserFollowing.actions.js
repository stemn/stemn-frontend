export const getUserFollowers = ({ userId }) => ({
  type: 'USER_FOLLOWERS/GET_FOLLOWING',
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
