import { produce } from 'immer'
import { get } from 'lodash'
import { mergeDeep, setIn } from 'stemn-shared/redux/draft'

import { parseMentions, removeExistingMentions, addMentionsToText } from '../Mentions/Mentions.utils.js'

const initialState = {
  /** ************************************
  [projectId] : {
    data: { changesData },
    selected: { the Selected Change},
    loading: true || false,
    name: 'commit summary',
    body: 'commit body'
  }
  ************************************* */
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGES/DESELECT_FILE_CHANGE':
      return produce(state, (draft) => {
        setIn(draft, [action.payload.projectId, 'selected'], {})
      })
    case 'CHANGES/SELECTED_FILE_CHANGE':
      return produce(state, (draft) => {
        setIn(draft, [action.payload.projectId, 'selected'], action.payload.selected)
      })
    case 'CHANGES/MENTION_THREADS': {
      const body = get(state, [action.payload.projectId, 'body'])
      const existingMentions = parseMentions(body)
      const uniqueNewMentions = removeExistingMentions(action.payload.mentions, existingMentions)
      const textWithMentions = addMentionsToText(state[action.payload.projectId].body, uniqueNewMentions)
      return produce(state, (draft) => {
        setIn(draft, [action.payload.projectId, 'body'], textWithMentions)
      })
    }
    case 'CHANGES/TOGGLE_ALL_CHANGED_FILES': {
      const checked = state[action.payload.projectId].data.reduce((obj, param) => {
        obj[param.data.fileId] = action.payload.value
        return obj
      }, {})
      return produce(state, (draft) => {
        setIn(draft, [action.payload.projectId, 'checked'], checked)
      })
    }

    case 'CHANGES/FETCH_CHANGES_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.projectId, 'loading'], true)
      })
    case 'CHANGES/FETCH_CHANGES_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.projectId, 'loading'], false)
      })
    case 'CHANGES/FETCH_CHANGES_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.projectId, 'data'], action.payload.data)
        setIn(draft, [action.meta.projectId, 'loading'], false)
      })

    case 'CHANGES/COMMIT_FULFILLED': {
      // POST /sync/commit returns the committed revisions as ids
      const idsToRemove = action.payload.data.revisions.map((item) => (typeof item === 'string' ? item : item._id))
      const remainingRevisions = state[action.meta.cacheKey].data.filter((item) => !idsToRemove.includes(item._id))
      // Deep merge: an existing `checked` object is kept as is (merging `{}` into it is a no-op)
      return produce(state, (draft) => {
        mergeDeep(draft, {
          [action.meta.cacheKey]: {
            name: '',
            body: '',
            data: remainingRevisions,
            checked: {},
          },
        })
      })
    }
    default:
      return state
  }
}

export default function (state = initialState, action) {
  return mainReducer(state, action)
}
