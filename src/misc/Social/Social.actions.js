import { actions } from 'react-redux-form'

export const checkStatus = (entityId, type) => (dispatch, getState) => {
  const userId = getState().auth.user._id
  if (userId) {
    dispatch({
      type: 'SOCIAL/GET_STATUS',
      httpPackage: {
        method: 'GET',
        url: '/api/v1/social',
        staticParams: {
          childId: userId,
          socialType: type,
        },
        params: {
          parentIds: entityId,
        },
      },
      meta: {
        entityId,
        type,
      },
    })
  }
}

export const add = ({ entityId, type, number, numberModel }) => (dispatch, getState) => {
  dispatch({
    // type = 'like' || 'follow'
    type: 'SOCIAL/ADD',
    auth: true,
    http: true,
    payload: {
      method: 'PUT',
      url: `/api/v1/users/${getState().auth.user._id}/${type}s/${entityId}`,
    },
    meta: {
      entityId,
      type,
    },
  })
  if (number && numberModel) {
    dispatch(actions.change(numberModel, number + 1))
  }
}

export const remove = ({ entityId, type, number, numberModel }) => (dispatch, getState) => {
  dispatch({
    type: 'SOCIAL/REMOVE',
    auth: true,
    http: true,
    payload: {
      method: 'DELETE',
      url: `/api/v1/users/${getState().auth.user._id}/${type}s/${entityId}`,
    },
    meta: {
      entityId,
      type,
    },
  })
  if (number && numberModel) {
    dispatch(actions.change(numberModel, number - 1))
  }
}
