import i from 'icepick';

import { modeled } from 'react-redux-form';
import { parseMentions, removeExistingMentions, addMentionsToText } from '../Mentions/Mentions.utils.js';

const initialState = {}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGES/SELECTED_FILE_CHANGE':
      return i.merge(state, {
        [action.payload.projectId] : {
          selected: action.payload.selected,
        }
      })
    case 'CHANGES/MENTION_TASKS':
      const existingMentions = parseMentions(state[action.payload.projectId].description);
      const uniqueNewMentions = removeExistingMentions(action.payload.mentions, existingMentions);
      const newText = addMentionsToText(state[action.payload.projectId].description, uniqueNewMentions);
      return i.assocIn(state, [action.payload.projectId, 'description'], newText);
    case 'CHANGES/TOGGLE_ALL_CHANGED_FILES':
      const allToggled = state[action.payload.projectId].data.map((item) => i.merge(item, {selected: action.payload.value }) );
      return i.merge(state, {
        [action.payload.projectId] : {
          data : allToggled
        }
      })
    case 'CHANGES/FETCH_CHANGES_FULFILLED':
      return i.merge(state, {
        [action.payload.config.meta.projectId] : {
          data : action.payload.data,
          selected: {},
        }
      })
    case 'CHANGES/COMMIT_FULFILLED':
      const idsToRemove = action.payload.data.revisions.map((item)=>item._id);
      const remainingRevisions = state[action.meta.cacheKey].data.filter((item)=>!idsToRemove.includes(item._id));

      return i.merge(state, {
        [action.meta.cacheKey] : {
          summary: '',
          description : '',
          data: remainingRevisions
        }
      })
    default:
      return state;
  }
}



export default function (state = initialState, action) {
  return modeled(mainReducer, 'changes')(state, action)
}
