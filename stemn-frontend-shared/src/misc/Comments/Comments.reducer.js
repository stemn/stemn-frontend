import { produce } from 'immer'
import { get } from 'lodash'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {
  data: {
    /** *****************************
    [commentId] : {
      loading,
      editActive,
      savePending,
      deletePending,
      data: main comment data,
      form,
    }
    ****************************** */
  },
  threads: {},
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'COMMENTS/GET_COMMENT_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId, 'loading'], true)
      })
    case 'COMMENTS/GET_COMMENT_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId, 'loading'], false)
      })
    case 'COMMENTS/GET_COMMENT_FULFILLED': {
      // getComment queries GET /comments?ids=<id>, which responds with an array
      const { data } = action.payload
      const comment = Array.isArray(data) ? data.find((item) => item._id === action.meta.commentId) || data[0] : data
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId], {
          loading: false,
          data: comment,
        })
      })
    }

    case 'COMMENTS/START_EDIT':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.payload.commentId, 'editActive'], true)
      })
    case 'COMMENTS/FINISH_EDIT':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.payload.commentId, 'editActive'], false)
      })

    case 'COMMENTS/NEW_COMMENT_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['threads', action.meta.threadId, 'newComment', 'savePending'], true)
      })
    case 'COMMENTS/NEW_COMMENT_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['threads', action.meta.threadId, 'newComment', 'savePending'], false)
      })
    case 'COMMENTS/NEW_COMMENT_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['threads', action.meta.threadId, 'newComment'], {}) // Reset the newComment objected
        setIn(draft, ['data', action.payload.data._id, 'data'], action.payload.data) // Put the comment in the store
      })

    case 'COMMENTS/DELETE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId, 'deletePending'], true)
      })
    case 'COMMENTS/DELETE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId, 'deletePending'], false)
      })
    case 'COMMENTS/DELETE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId], undefined)
      })

    case 'COMMENTS/UPDATE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId, 'savePending'], true)
      })
    case 'COMMENTS/UPDATE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId, 'savePending'], false)
      })
    case 'COMMENTS/UPDATE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.commentId], {
          data: action.payload.data,
          savePending: false,
        })
      })

    case 'COMMENTS/NEW_REACTION_FULFILLED':
      return produce(state, (draft) => {
        get(draft, ['data', action.meta.commentId, 'data', 'reactions']).push(action.payload.data)
      })
    case 'COMMENTS/DELETE_REACTION_FULFILLED':
      return produce(state, (draft) => {
        const reactions = get(draft, ['data', action.meta.commentId, 'data', 'reactions'])
        const index = reactions.findIndex(
          (reaction) => reaction.type === action.meta.reactionType && reaction.owner._id === action.meta.userId,
        )
        if (index !== -1) reactions.splice(index, 1)
      })

    default:
      return state
  }
}

export default function (state = initialState, action) {
  return mainReducer(state, action)
}
