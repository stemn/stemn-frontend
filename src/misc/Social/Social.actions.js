import http from 'axios'
import { actions } from 'react-redux-form'

export const checkStatus = (entityId, type) => (dispatch, getState) => dispatch({
  type: 'SOCIAL/GET_STATUS',
  http: true,
  payload: {
    method: 'GET',
    url: '/api/v1/social',
    params: {
      parentId: entityId,
      socialType: type,
      childId: getState().auth.user._id,
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
  dispatch(actions.change(numberModel, number + 1))
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
  dispatch(actions.change(numberModel, number - 1))
}
