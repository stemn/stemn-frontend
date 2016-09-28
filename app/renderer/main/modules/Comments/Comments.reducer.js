import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {
  data: {},
  tasks: {}
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'COMMENTS/GET_COMMENT_PENDING':
      return i.assocIn(state, ['data', action.meta.commentId, 'loading'], true)
    case 'COMMENTS/GET_COMMENT_REJECTED':
      return i.assocIn(state, ['data', action.meta.commentId, 'loading'], false)
    case 'COMMENTS/GET_COMMENT_FULFILLED':
      return i.assocIn(state, ['data', action.meta.commentId], {
        loading: false,
        data: action.payload.data
      })


    case 'COMMENTS/START_EDIT':
      return i.assocIn(state, ['data', action.payload.commentId, 'editActive'], true)
    case 'COMMENTS/FINISH_EDIT':
      return i.assocIn(state, ['data', action.payload.commentId, 'editActive'], false)


    case 'COMMENTS/NEW_COMMENT_PENDING':
      return i.assocIn(state, ['tasks', action.meta.taskId, 'newComment', 'savePending'], true)
    case 'COMMENTS/NEW_COMMENT_REJECTED':
      return i.assocIn(state, ['tasks', action.meta.taskId, 'newComment', 'savePending'], false)
    case 'COMMENTS/NEW_COMMENT_FULFILLED':
      console.log(action);
      return i.chain(state)
        .assocIn(['tasks', action.meta.taskId, 'newComment'], {}) // Reset the newComment objected
        .assocIn(['data', action.payload.data._id, 'data'], action.payload.data) // Put the comment in the store
        .value();

    case 'COMMENTS/DELETE_PENDING':
      return i.assocIn(state, ['data', action.meta.commentId, 'deletePending'], true)
    case 'COMMENTS/DELETE_REJECTED':
      return i.assocIn(state, ['data', action.meta.commentId, 'deletePending'], false)
    case 'COMMENTS/DELETE_FULFILLED':
      return i.assocIn(state, ['data', action.meta.commentId], undefined)

    case 'COMMENTS/UPDATE_PENDING':
      return i.assocIn(state, ['data', action.meta.commentId, 'savePending'], true)
    case 'COMMENTS/UPDATE_REJECTED':
      return i.assocIn(state, ['data', action.meta.commentId, 'savePending'], false)
    case 'COMMENTS/UPDATE_FULFILLED':
      return i.assocIn(state, ['data', action.meta.commentId], {
        data: action.payload.data,
        savePending: false
      })


    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'comments')(state, action)
}
