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


export function saveUser({user}) {
  return {
    type: 'USERS/SAVE_USER',
    http: true,
    payload: {
      method: 'PUT',
      url: `http://localhost:3000/api/v1/users/${user._id}`,
      data: user
    },
    meta: {
      userId: user._id
    }
  }
}
