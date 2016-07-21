export const SELECTED_FILE_CHANGE = 'CHANGES/SELECTED_FILE_CHANGE'
export const TOGGLE_ALL_CHANGED_FILES = 'CHANGES/TOGGLE_ALL_CHANGED_FILES'


import { actions } from 'react-redux-form';

export function selectedFileChange(file) {
  return {
      type: SELECTED_FILE_CHANGE,
      payload: file
  }
}

export function actToggleAll(model, value) {
//  return (dispatch) => {
//    dispatch(actions.change(model, value));
//    return {
//        type: TOGGLE_ALL_CHANGED_FILES,
//        payload: {model, value}
//    }
//  };

  return {
      type: TOGGLE_ALL_CHANGED_FILES,
      payload: {model, value}
  }
}
