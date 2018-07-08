export const getUserFollowing = ({ userId, page = 1, size }) => ({
  type: 'USER_FOLLOWING/GET_FOLLOWING',
  http: true,
  payload: {
    method: 'GET',
    url: 'api/v1/social',
    params: {
      parentType: 'user',
      childType: 'user',
      childId: userId,
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
