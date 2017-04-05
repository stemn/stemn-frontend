import http from 'axios';

export const checkIsLiked = (entityId) => (dispatch, getState) => {
  const { likes, auth } = getState();

  http({
    method: 'GET',
    url: '/api/v1/social',
    params: {
      parentId: entityId,
      socialType: 'like',
      childId: auth.user._id
    }
  })
  .then((response) => {

    const liked = response.data[0].status;

    dispatch({
      type: 'PROJECTS/UPDATE_LIKED',
      payload: {
        projectId: entityId,
        liked
      }
    })

    dispatch({
      type: 'LIKES/UPDATE_LIKED',
      payload: {
        entityId,
        liked
      }
    })
  })
}

export const like = (entityId) => (dispatch, getState) => {
  const { likes, auth } = getState();

  dispatch({
    type: 'LIKES/LIKE',
    payload: http({
      method: 'PUT',
      url: `/api/v1/users/${auth.user._id}/likes/${entityId}`
    }),
    meta: {
      entityId
    }
  })

  dispatch({
    type: 'PROJECTS/SET_LIKED',
    payload: {
      projectId: entityId
    }
  })
}

export const unlike = (entityId) => (dispatch, getState) => {
  const { likes, auth } = getState();

  dispatch({
    type: 'LIKES/UN_LIKE',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/users/${auth.user._id}/likes/${entityId}`
    }),
    meta: {
      entityId
    }
  })

  dispatch({
    type: 'PROJECTS/SET_UN_LIKED',
    payload: {
      projectId: entityId
    }
  })
}
