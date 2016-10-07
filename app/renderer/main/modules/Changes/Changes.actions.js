import { actions }           from 'react-redux-form';
import { show as showToast } from '../Toasts/Toasts.actions.js';
import { showModal }         from '../Modal/Modal.actions.js';
import { parseMentions }     from '../Mentions/Mentions.utils.js';
import { updateTask }        from '../Tasks/Tasks.actions.js';
import i                     from 'icepick';
import http                  from 'axios';

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
        url: `http://localhost:3000/api/v1/sync/timeline/${projectId}`,
        params: {
          types: ['changes'],
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
  return {
    type:'CHANGES/MENTION_TASKS',
    payload: {
      projectId,
      mentions
    }
  }
}

export function commit({projectId, revisions, summary, description}) {
  return (dispatch, getState) => {
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
        // Get the mentions
        const mentions = parseMentions(response.data.description);
        // If mentionType: task-complete, we set the task to complete.
        console.log(mentions);
        mentions.forEach(mention => {
          if(mention.mentionType == 'task-complete'){
            dispatch(actions.change(`tasks.data.${mention.entityId}.data.complete`, true));
          }
        });
        return response
      }),
      meta: {
        cacheKey: projectId
      }
    })
  }
}
