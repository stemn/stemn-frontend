import http from 'axios'
import { addEvent, deleteEvent } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import confirmAuth from 'stemn-shared/misc/Auth/actions/confirmAuth'

export function getComment({ commentId }) {
  return {
    type: 'COMMENTS/GET_COMMENT',
    httpPackage: {
      url: '/api/v1/comments',
      method: 'GET',
      params: {
        ids: commentId,
      },
    },
    meta: {
      commentId,
    },
  }
}

export function newComment({ comment, timelineCacheKey }) {
  return (dispatch, getState) => {
    if (comment && comment.body && comment.body.length > 0) {
      return dispatch({
        type: 'COMMENTS/NEW_COMMENT',
        payload: http({
          url: `/api/v1/threads/${comment.thread}/comments`,
          method: 'POST',
          data: comment,
        }),
        meta: {
          threadId: comment.thread,
        },
      }).then(({ value }) => {
        const currentUser = getState().auth.user
        return dispatch(addEvent({
          cacheKey: timelineCacheKey,
          event: {
            event: 'comment',
            timestamp: value.data.timestamp,
            user: {
              name: currentUser.name,
              _id: currentUser._id,
              picture: currentUser.picture,
            },
            data: {
              comment: value.data._id,
            },
          },
        }))
      })
    }
  }
}

export const toggleReaction = ({ commentId, reactionType }) => confirmAuth((dispatch, getState) => {
  const reactions = getState().comments.data[commentId].data.reactions
  const userId = getState().auth.user._id
  const reactionExists = reactions.find(reaction => reaction.owner._id === userId && reaction.type === reactionType)

  if (reactionExists) {
    dispatch(deleteReaction({ commentId, reactionType }))
  } else {
    dispatch(newReaction({ commentId, reactionType }))
  }
})

export const newReaction = ({ commentId, reactionType }) => confirmAuth((dispatch) => {
  const reaction = {
    type: reactionType,
  }

  dispatch({
    type: 'COMMENTS/NEW_REACTION',
    http: true,
    payload: {
      url: `/api/v1/comments/${commentId}/reaction`,
      method: 'POST',
      data: reaction,
    },
    meta: {
      commentId,
    },
  })
})


export function deleteReaction({ commentId, reactionType }) {
  return (dispatch, getState) => {
    dispatch({
      type: 'COMMENTS/DELETE_REACTION',
      http: true,
      payload: {
        url: `/api/v1/comments/${commentId}/reaction/${reactionType}`,
        method: 'DELETE',
      },
      meta: {
        commentId,
        reactionType,
        userId: getState().auth.user._id,
      },
    })
  }
}

export function startEdit({ commentId }) {
  return {
    type: 'COMMENTS/START_EDIT',
    payload: {
      commentId,
    },
  }
}

export function finishEdit({ commentId }) {
  return {
    type: 'COMMENTS/FINISH_EDIT',
    payload: {
      commentId,
    },
  }
}

export function deleteComment({ comment, timelineCacheKey }) {
  return (dispatch, getState) => {
    dispatch({
      type: 'COMMENTS/DELETE',
      payload: http({
        url: `/api/v1/comments/${comment._id}`,
        method: 'DELETE',
      }),
      meta: {
        commentId: comment._id,
        threadId: comment.thread,
      },
    }).then((response) => {
      // Get the eventId of the comment
      console.log(getState().syncTimeline[timelineCacheKey])
      const event = getState().syncTimeline[timelineCacheKey].data.find(event => event.data.comment === comment._id)
      console.log({ event })
      if (event) {
        dispatch(deleteEvent({
          cacheKey: timelineCacheKey,
          eventId: event._id,
        }))
      }
    })
  }
}


export function updateComment({ comment }) {
  return {
    type: 'COMMENTS/UPDATE',
    http: true,
    payload: {
      url: `/api/v1/comments/${comment._id}`,
      method: 'PUT',
      data: comment,
    },
    meta: {
      commentId: comment._id,
    },
  }
}
