import { actions } from 'react-redux-form';
import http from 'axios';

export const SELECTED_FILE_CHANGE = 'CHANGES/SELECTED_FILE_CHANGE'
export const TOGGLE_ALL_CHANGED_FILES = 'CHANGES/TOGGLE_ALL_CHANGED_FILES'



export function selectedFileChange(file) {
  return {
      type: SELECTED_FILE_CHANGE,
      payload: file
  }
}
export function commitDescriptionChange({value}) {
  return {
      type: 'CHANGES/COMMIT_DESCRIPTION_CHANGE',
      payload: {value}
  }
}

export function actToggleAll(model, value) {
  return (dispatch) => {
    dispatch(actions.change(model, value));
    return {
        type: TOGGLE_ALL_CHANGED_FILES,
        payload: {model, value}
    }
  };
}

export function fetchChanges({stub}) {
  return {
      type:'CHANGES/FETCH_CHANGES',
      payload: http({
        method: 'GET',
        url: `http://localhost:3000/api/v1/sync/timeline/${stub}`,
        params: {
          type: 'revisions'
        },
        meta: {
          stub
        }
      })
  }
}

export function commit({projectId, revisions, summary, description}) {
  return {
    type: 'CHANGES/COMMIT',
    payload: http({
      method: 'POST',
      url: `http://localhost:3000/api/v1/sync/commit/${projectId}`,
      data: {
        revisions,
        summary,
        description,
      }
    })
  };
}
