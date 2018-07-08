export const getUserStars = ({ userId, page = 1, size }) => ({
  type: 'USER_STARS/GET_STARS',
  http: true,
  payload: {
    method: 'GET',
    url: 'api/v1/social',
    params: {
      childType: 'user',
      childId: userId,
      socialType: 'like',
      size,
      page,
    },
  },
  meta: {
    userId,
    page,
  },
})
