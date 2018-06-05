export const getUserFollowers = ({ userId, page = 1, size }) => ({
  type: 'USER_FOLLOWERS/GET_FOLLOWERS',
  http: true,
  payload: {
    method: 'GET',
    url: 'api/v1/social',
    params: {
      parentType: 'user',
      parentId: userId,
      socialType: 'follow',
      size,
      page,
    },
  },
  meta: {
    userId,
    page,
  },
})
