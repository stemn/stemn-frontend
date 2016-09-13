import { actions } from 'react-redux-form';
import { show as showToast } from '../../renderer/main/modules/Toasts/Toasts.actions.js';

import http from 'axios';

export function selectedFileChange({projectId, selected}) {
  return {
      type: 'CHANGES/SELECTED_FILE_CHANGE',
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
  return (dispatch) => {
    dispatch(pullChanges({projectId}))
    dispatch({
      type:'CHANGES/FETCH_CHANGES',
      http: true,
      payload: {
        method: 'GET',
        url: `http://localhost:3000/api/v1/sync/timeline/${projectId}`,
        params: {
          type: 'changes'
        },
        meta: {
          projectId
        }
      }
    })
  }
}

export function pullChanges({projectId}) {
  return {
    type:'CHANGES/PULL_REMOTE_CHANGES',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/pullRemoteChanges/${projectId}`,
    }
  }
}

export function commit({projectId, revisions, summary, description}) {
  return (dispatch) => {
    dispatch({
      type: 'CHANGES/COMMIT',
      payload: http({
        method: 'POST',
        url: `http://localhost:3000/api/v1/sync/commit/${projectId}`,
        data: {
          revisions,
          summary,
          description,
        }
      }).then((response)=>{

        dispatch(showToast({
          title: `${revisions.length} files commited.`,
          actions: [{
            text: 'Undo',
            action: {
              type: 'CHANGES/COMMIT_UNDO',
              payload: {
                commitId: response.data._id
              }
            }
          }]
        }))

        return response
      }),
      meta: {
        cacheKey: projectId
      }
    })
  }
}
