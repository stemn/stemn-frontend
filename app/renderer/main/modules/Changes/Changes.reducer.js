import i from 'icepick';

import { modeled } from 'react-redux-form';
import { parseMentions, removeExistingMentions, addMentionsToText } from '../Mentions/Mentions.utils.js';
const initialState = {
  /**************************************
  [projectId] : {
    data: { changesData },
    selected: { the Selected Change},
    loading: true || false,
    summary: 'commit summary',
    description: 'commit description'
  }
  **************************************/
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGES/DESELECT_FILE_CHANGE':
      return i.assocIn(state, [action.payload.projectId, 'selected'], {})
    case 'CHANGES/SELECTED_FILE_CHANGE':
      return i.assocIn(state, [action.payload.projectId, 'selected'], action.payload.selected)
    case 'CHANGES/MENTION_TASKS':
      return i.updateIn(state, [action.payload.projectId, 'description'], (description) => {
        const existingMentions = parseMentions(description);
        const uniqueNewMentions = removeExistingMentions(action.payload.mentions, existingMentions);
        return addMentionsToText(state[action.payload.projectId].description, uniqueNewMentions);
      });
    case 'CHANGES/TOGGLE_ALL_CHANGED_FILES':
      return i.updateIn(state, [action.payload.projectId], (changes) => {
        const checked = changes.data.reduce((obj, param) => {
          obj[param.data.fileId] = action.payload.value;
          return obj;
        }, {});
        return i.assoc(changes, 'checked', checked);
      })

    case 'CHANGES/FETCH_CHANGES_PENDING':
      return i.assocIn(state, [action.meta.projectId, 'loading'], true);
    case 'CHANGES/FETCH_CHANGES_REJECTED':
      return i.assocIn(state, [action.meta.projectId, 'loading'], false);
    case 'CHANGES/FETCH_CHANGES_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.projectId, 'data'], action.payload.data)
        .assocIn([action.meta.projectId, 'loading'], false)
        .value();

    case 'CHANGES/COMMIT_FULFILLED':
      const idsToRemove = action.payload.data.revisions.map((item)=>item._id);
      const remainingRevisions = state[action.meta.cacheKey].data.filter((item)=>!idsToRemove.includes(item._id));
      return i.merge(state, {
        [action.meta.cacheKey] : {
          summary: '',
          description : '',
          data: remainingRevisions,
          checked: {}
        }
      })
    default:
      return state;
  }
}



export default function (state = initialState, action) {
  return modeled(mainReducer, 'changes')(state, action)
}
