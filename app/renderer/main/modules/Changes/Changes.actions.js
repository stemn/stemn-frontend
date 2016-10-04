import { actions } from 'react-redux-form';
import { show as showToast } from '../Toasts/Toasts.actions.js';
import { showModal }         from '../Modal/Modal.actions.js';

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
        url: `/api/v1/sync/timeline/${projectId}`,
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
      url: `/api/v1/sync/pullRemoteChanges/${projectId}`,
    }
  }
}

export function mentionTasksModal({projectId, mentions}) {
  return (dispatch) => {
    dispatch(showModal({
      modalType: 'TASK_COMMIT',
      modalProps: {
        projectId: projectId
      },
      modalConfirm: {
        functionAlias: 'ChangesActions.mentionTasks',
        functionInputs: { projectId }
      }
    }))
  }
}

export function mentionTasks({projectId, mentions}) {
  console.log(projectId, mentions);
  return {
    type:'CHANGES/MENTION_TASKS',
    payload: {
      projectId,
      mentions
    }
  }
}

export function commit({projectId, revisions, summary, description}) {
  return (dispatch) => {
    dispatch({
      type: 'CHANGES/COMMIT',
      payload: http({
        method: 'POST',
        url: `/api/v1/sync/commit/${projectId}`,
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
