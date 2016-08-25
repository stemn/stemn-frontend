export function getUser({userId}) {
  return {
    type: 'USERS/GET_USER',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/users/${userId}`
    },
    meta: {
      cacheKey: userId
    }
  };
}
