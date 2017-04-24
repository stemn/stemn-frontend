import http from 'axios';
import * as TasksActions from '../Tasks/Tasks.actions.js';

export function getComment({commentId}) {
  return {
    type: 'COMMENTS/GET_COMMENT',
    httpPackage: {
      url: `/api/v1/comments`,
      method: 'GET',
      params: {
        'ids' : commentId
      }
    },
    meta: {
      commentId
    },
  }
}

export function newComment({ comment }) {
  return (dispatch) => {
    if(comment && comment.body && comment.body.length > 0){
      dispatch({
        type: 'COMMENTS/NEW_COMMENT',
        payload: http({
          url: `/api/v1/tasks/${comment.task}/comments`,
          method: 'POST',
          data: comment
        }),
        meta: {
          taskId: comment.task
        }
      }).then(response => {
        dispatch(TasksActions.newEvent({
          taskId: comment.task,
          event: {
            event: 'comment',
            data: {
              comment: response.value.data._id
            }
          }
        }))
      })
    }
  }
}

export function toggleReaction({commentId, reactionType}) {
  return (dispatch, getState) => {
    const reactions = getState().comments.data[commentId].data.reactions;
    const userId = getState().auth.user._id;
    const reactionExists = reactions.find(reaction => reaction.owner._id == userId && reaction.type == reactionType);

    if(reactionExists){
      dispatch(deleteReaction({commentId, reactionType}))
    }
    else{
      dispatch(newReaction({commentId, reactionType}))
    }
  }
}

export function newReaction({commentId, reactionType}) {
  return (dispatch) => {

    const reaction = {
      type: reactionType
    };

    dispatch({
      type: 'COMMENTS/NEW_REACTION',
      http: true,
      payload: {
        url: `/api/v1/comments/${commentId}/reaction`,
        method: 'POST',
        data: reaction
      },
      meta: {
        commentId,
      }
    })
  }
}

export function deleteReaction({commentId, reactionType}) {
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
        userId: getState().auth.user._id
      }
    })
  }
}

export function startEdit({commentId}) {
  return {
    type: 'COMMENTS/START_EDIT',
    payload: {
      commentId
    }
  }
}

export function finishEdit({commentId}) {
  return {
    type: 'COMMENTS/FINISH_EDIT',
    payload: {
      commentId
    }
  }
}

export function deleteComment({comment}) {
  return (dispatch, getState) => {
    dispatch({
      type: 'COMMENTS/DELETE',
      payload: http({
        url: `/api/v1/comments/${comment._id}`,
        method: 'DELETE'
      }),
      meta: {
        commentId: comment._id,
        taskId: comment.task
      }
    }).then(response => {
      // Get the eventId of the comment
      const event = getState().tasks.events[comment.task].data.find(event => event.comment == comment._id);
      if(event){
        dispatch(TasksActions.deleteEvent({
          taskId: comment.task,
          eventId: event._id
        }))
      }
    })
  }
}


export function updateComment({comment}) {
  return {
    type: 'COMMENTS/UPDATE',
    http: true,
    payload: {
      url: `/api/v1/comments/${comment._id}`,
      method: 'PUT',
      data: comment
    },
    meta: {
      commentId: comment._id
    }
  }
}
