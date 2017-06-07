import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

export const checkStatus = ({ entityId, entityType, type }) => (dispatch, getState) => {
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

export const add = ({ entityId, entityType, type, number, numberModel }) => (dispatch, getState) => {
  dispatch({
    // type = 'like' || 'follow'
    type: 'SOCIAL/ADD',
    auth: true,
    http: true,
    payload: {
      method: 'PUT',
      url: '/api/v1/social',
      data: {
        parentType: entityType,
        parentId: entityId,
        socialType: type,
      },
    },
    meta: {
      entityId,
      type,
    },
  })
  if (number && numberModel) {
    dispatch(storeChange(numberModel, number + 1))
  }
}

export const remove = ({ entityId, entityType, type, number, numberModel }) => (dispatch, getState) => {
  dispatch({
    type: 'SOCIAL/REMOVE',
    auth: true,
    http: true,
    payload: {
      method: 'DELETE',
      url: '/api/v1/social',
      params: {
        parentType: entityType,
        parentId: entityId,
        socialType: type,
      },
    },
    meta: {
      entityId,
      type,
    },
  })
  if (number && numberModel) {
    dispatch(storeChange(numberModel, number - 1))
  }
}
