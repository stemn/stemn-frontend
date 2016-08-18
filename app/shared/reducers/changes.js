
import {
  SELECTED_FILE_CHANGE
} from '../actions/changes';

import u from 'updeep';
import { formReducer, modeled } from 'react-redux-form';
import {assignAll} from '../helpers/reducerUtils.js'

const initialState = {

}

const mainReducer = (state, action) => {
  switch (action.type) {
    case SELECTED_FILE_CHANGE:
      return u({
        [action.payload.projectId] : {
          selected: action.payload.selected,
        }
      }, state)
    case 'CHANGES/TOGGLE_ALL_CHANGED_FILES':
      const assignAll = (field) => field.map((item) => u({selected: action.payload.value }, item))
      return u({
        [action.payload.projectId] : {
          data : assignAll
        }
      }, state)
    case 'CHANGES/FETCH_CHANGES_FULFILLED':
      return u({
        [action.payload.config.meta.projectId] : {
          data : action.payload.data,
          selected: {},
        }
      }, state)
    case 'CHANGES/COMMIT_DESCRIPTION_CHANGE':
      return u({
        [action.payload.projectId] : {
          description : action.payload.value
        }
      }, state)
    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'changes')(state, action)
}
