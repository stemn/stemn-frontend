import {
  SELECTED_FILE_CHANGE,
  TOGGLE_ALL_CHANGED_FILES
} from '../actions/changes';

import { formReducer, modeled } from 'react-redux-form';

import {assignAll} from '../helpers/reducerUtils.js'

const initialState = {
  model: {
    files: [
      {
        name: 'asfasfasfasf1',
        selected: true
      },
      {
        name: 'asfasfasfasf2',
        selected: true
      },
      {
        name: 'asfasfasfasf3',
        selected: false
      },
      {
        name: 'asfasfasfasf4',
        selected: false
      },
      {
        name: 'asfasfasfasf5',
        selected: false
      },
      {
        name: 'asfasfasfasf6',
        selected: true
      },
      {
        name: 'asfasfasfasf7',
        selected: true
      },
      {
        name: 'asfasfasfasf8',
        selected: true
      },
      {
        name: 'asfasfasfasf9',
        selected: false
      },
    ],
    toggleAll: false,
    selectedFile: {},

    commitSummary: '',
    commitDescription: ''
  }
}


const CommitChanges = (state, action) => {
  switch (action.type) {
    case SELECTED_FILE_CHANGE:
      return {...state,
        selectedFile: action.payload
      }
    case TOGGLE_ALL_CHANGED_FILES:
      return {...state,
        files: assignAll(state.files, 'selected', action.payload.value)
      }
    case 'CHANGES/COMMIT_DESCRIPTION_CHANGE':
      return {...state,
        commitDescription: action.payload.value
      }
    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return {
    model: modeled(CommitChanges, 'changes.model')(state.model, action),
    form : formReducer('changes.form')(state.form, action)
  }
}
