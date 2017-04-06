// export function getUser({ userId }) {
//   return {
//     type: 'USERS/GET_USER',
//     http: true,
//     payload: {
//       method: 'GET',
//       url: `/api/v1/users/${userId}`
//     },
//     meta: {
//       cacheKey: userId
//     }
//   };
// }

const fields = {
  sm: ['name', 'picture', 'stub'],
  md: ['name', 'picture', 'stub', 'blurb'],
  lg: ''
}

const shouldDownload = (requestedSize, existingSize) => {
  if (requestedSize === existingSize) {
    return false
  }

  if (requestedSize === 'sm' && (existingSize === 'md' || existingSize === 'lg')) {
    return false
  }

  if (requestedSize === 'md' && existingSize === 'lg') {
    return false
  }

  // we don't have the requested data locally, we should download
  return true
}

export const getUser = ({ userId, size = 'lg', force }) => (dispatch, getState) => {
  const user = getState().users[userId]

  const existingSize = user
    ? user.dataSize
    : undefined

  if (shouldDownload(size, existingSize) || force) {
    return dispatch({
      type: 'USERS/GET_USER',
      httpPackage: {
        url: '/api/v1/users',
        method: 'GET',
        staticParams: {
          select: fields[size]
        },
        params: {
          ids: userId
        }
      },
      meta: {
        userId,
        size
      }
    })
  }
}

export const saveUser = ({ user }) => ({
  type: 'USERS/SAVE_USER',
  http: true,
  payload: {
    method: 'PUT',
    url: `/api/v1/users/${user._id}`,
    data: user
  },
  meta: {
    userId: user._id
  }
})

export const getCommitHistory = ({ userId }) => ({
  type: 'USERS/GET_COMMIT_HISTORY',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/users/${userId}/commitHistory`,
  },
  meta: {
    userId
  }
})
