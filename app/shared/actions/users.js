export function getUser({userId}) {
  return {
    type: 'USERS/GET_USER',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/users/${userId}`
    },
    meta: {
      cacheKey: userId
    }
  };
}
