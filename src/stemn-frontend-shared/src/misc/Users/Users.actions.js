import { shouldDownload } from '../../redux/utils'
import updateUser from 'stemn-shared/misc/Auth/actions/updateUser'

const fields = {
  sm: ['name', 'picture', 'stub'],
  md: ['name', 'picture', 'stub', 'blurb'],
  lg: ['*'],
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
          select: fields[size],
        },
        params: {
          ids: userId,
        },
      },
      meta: {
        userId,
        size,
      },
    })
  }
}

export const saveUser = ({ user }) => (dispatch, getState) => {
  dispatch({
    type: 'USERS/SAVE_USER',
    http: true,
    payload: {
      method: 'PUT',
      url: `/api/v1/users/${user._id}`,
      data: user,
    },
    meta: {
      userId: user._id,
    },
  }).then((response) => {
    const currentUserId = getState().auth.user._id
    // If the user we are updating is the current user,
    // we must run updateUser to update the user details in auth.
    if (user._id  === currentUserId) {
      dispatch(updateUser({ user: response.value.data }))
    }
  })
}
