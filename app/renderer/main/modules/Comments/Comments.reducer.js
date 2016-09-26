import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {
  data: {},
  tasks: {}
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'COMMENTS/GET_COMMENTS':
      const responseData = {};
      action.payload.response.data.forEach((item)=>{
        responseData[item._id] = {data: item};
      });

      return i.merge(state, {
        data: responseData,
        tasks: {
          [action.meta.taskId] : {}
        }
      })
    case 'COMMENTS/START_EDIT':
      return i.merge(state, {
        data: {
          [action.payload.commentId] : {
            editActive: true
          }
        }
      })
    case 'COMMENTS/FINISH_EDIT':
      return i.merge(state, {
        data: {
          [action.payload.commentId] : {
            editActive: false
          }
        }
      })

    case 'COMMENTS/NEW_COMMENT_PENDING':
      return i.assocIn(state, ['tasks', action.meta.taskId, 'newComment', 'savePending'], true)
    case 'COMMENTS/NEW_COMMENT_FULFILLED':
      return i.chain(state)
        .assocIn(['tasks', action.meta.taskId, 'newComment'], {}) // Reset the newComment objected
        .assocIn(['data', action.payload.data._id, 'data'], action.payload.data) // Put the comment in the store
        .value();
    case 'COMMENTS/NEW_COMMENT_REJECTED':
      return i.assocIn(state, ['tasks', action.meta.taskId, 'newComment', 'savePending'], false)


    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'comments')(state, action)
}
