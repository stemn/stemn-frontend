export function getUser({userId}) {
  return {
    type: 'USERS/GET_USER',
    http: true,
    payload: {
      method: 'GET',
      url: `https://${process.env.API_SERVER}/api/v1/users/${userId}`
    },
    meta: {
      cacheKey: userId
    }
  };
}
