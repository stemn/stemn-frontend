import {
  SELECTED_FILE_CHANGE,
  TOGGLE_ALL_CHANGED_FILES
} from '../actions/changes';

import { modelReducer, formReducer, modeled } from 'react-redux-form';
import { combineReducers } from 'redux'

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
    selectedFile: {}
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
        default:
          return state;
    }
}

export default function (state = initialState, action) {
  return {
    model: modeled(CommitChanges, 'CommitChanges.model')(state.model, action),
    form : formReducer('CommitChanges.form')(state.form, action)
  }
}
