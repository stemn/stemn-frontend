import { actions } from 'react-redux-form';

export const SELECTED_FILE_CHANGE = 'CHANGES/SELECTED_FILE_CHANGE'
export const TOGGLE_ALL_CHANGED_FILES = ''



export function selectedFileChange({projectId, selected}) {
  return {
      type: SELECTED_FILE_CHANGE,
      payload: {
        projectId,
        selected
      }
  }
}
export function descriptionChange({projectId, value}) {
  return {
    type: 'CHANGES/COMMIT_DESCRIPTION_CHANGE',
    payload: {projectId, value}
  }
}


export function actToggleAll({projectId, model, value}) {
  return (dispatch) => {
    dispatch(actions.change(model, value));
    return {
        type: 'CHANGES/TOGGLE_ALL_CHANGED_FILES',
        payload: {projectId, model, value}
    }
  };
}


export function fetchChanges({projectId}) {
  return {
    type:'CHANGES/FETCH_CHANGES',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/timeline/${projectId}`,
      params: {
        type: 'revisions'
      },
      meta: {
        projectId
      }
    }
  }
}

export function commit({projectId, revisions, summary, description}) {
  return {
    type: 'CHANGES/COMMIT',
    http: true,
    payload: {
      method: 'POST',
      url: `http://localhost:3000/api/v1/sync/commit/${projectId}`,
      data: {
        revisions,
        summary,
        description,
      }
    }
  };
}
