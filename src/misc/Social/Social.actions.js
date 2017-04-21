import http from 'axios'
import { actions } from 'react-redux-form'

export const checkStatus = (entityId, type) => (dispatch, getState) => dispatch({
  type: 'SOCIAL/GET_STATUS',
  httpPackage: {
    method: 'GET',
    url: '/api/v1/social',
    staticParams: {
      childId: getState().auth.user._id,
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

export const add = ({ entityId, type, number, numberModel }) => (dispatch, getState) => {
  dispatch({
    // type = 'like' || 'follow'
    type: 'SOCIAL/ADD',
    payload: http({
      method: 'PUT',
      url: `/api/v1/users/${getState().auth.user._id}/${type}s/${entityId}`,
    }),
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
    payload: http({
      method: 'DELETE',
      url: `/api/v1/users/${getState().auth.user._id}/${type}s/${entityId}`,
    }),
    meta: {
      entityId,
      type,
    },
  })
  if (number && numberModel) {
    dispatch(actions.change(numberModel, number - 1))
  }
}
