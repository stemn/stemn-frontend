
export function getComments({taskId}) {
  return {
    type: 'COMMENTS/GET_COMMENTS',
    meta: {
      taskId
    },
    payload: {

    },
  }
}

export function newComment({comment}) {
  return (dispatch) => {
    if(comment.body && comment.body.length > 0){
      dispatch({
        type: 'COMMENTS/NEW_COMMENT',
        http: true,
        payload: {
          url: `/api/v1/tasks/${comment.task}/comments`,
          method: 'POST',
          data: comment
        },
        meta: {
          taskId: comment.task
        }
      })
    }
  }
}
//        body        :  { type : String,   default : ''         },
//        task        :  { type : ObjectId, ref     : 'Task'     },
//        owner       :  { type : ObjectId, ref     : 'User'     },
//        timestamp   :  { type : Date,     default : Date.now   },
//        edited      :  { type : Date,                          },
//        reactions   : [{
//            _id     :  { type : ObjectId                       },
//            owner   :  { type : ObjectId, ref     : 'User'     },
//            type    :  { type : Number,   default : 0          }
//        }]

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

export function deleteComment({commentId}) {
  return {
    type: 'COMMENTS/DELETE',
    payload: {
      commentId
    }
  }
}
export function saveComment({commentId}) {
  return {
    type: 'COMMENTS/SAVE',
    payload: {
      commentId
    }
  }
}

