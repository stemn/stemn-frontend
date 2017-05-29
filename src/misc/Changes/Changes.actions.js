import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import { show as showToast } from '../Toasts/Toasts.actions.js';
import { showModal }         from '../Modal/Modal.actions.js';
import { parseMentions }     from '../Mentions/Mentions.utils.js';
import { updateTask }        from '../Tasks/Tasks.actions.js';
import i                     from 'icepick';
import http                  from 'axios';
import { get }               from 'lodash';
import TaskMentionModalName from 'stemn-shared/misc/Mentions/TaskMentionModal'

export function deselect({projectId}) {
  return {
    type: 'CHANGES/DESELECT_FILE_CHANGE',
    payload: {
      projectId,
    }
  }
}
export function selectedFileChange({projectId, selected}) {
  return {
    type: 'CHANGES/SELECTED_FILE_CHANGE',
    payload: {
      projectId,
      selected
    }
  }
}

export function toggleAll({projectId, value}) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CHANGES/TOGGLE_ALL_CHANGED_FILES',
      payload: {projectId, value}
    })
  };
}


export function fetchChanges({projectId}) {
  return (dispatch) => {
    dispatch({
      type:'CHANGES/FETCH_CHANGES',
      http: true,
      payload: {
        method: 'GET',
        url: `/api/v1/sync/timeline/${projectId}`,
        params: {
          types: ['changes'],
        },
      },
      meta: {
        projectId
      }
    })
  }
}

//export function pullChanges({projectId}) {
//  return {
//    type:'CHANGES/PULL_REMOTE_CHANGES',
//    http: true,
//    payload: {
//      method: 'GET',
//      url: `/api/v1/sync/pullRemoteChanges/${projectId}`,
//    }
//  }
//}

export function mentionTasksModal({projectId, mentions}) {
  return (dispatch) => {
    dispatch(showModal({
      modalType: TaskMentionModalName,
      modalProps: {
        projectId: projectId,
        cacheKey: projectId,
      },
    })).then(({ value: { mentions } }) => {
      dispatch(mentionTasks({
        projectId,
        mentions,
      }))
    })
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

export function commit({projectId, summary, description}) {
  return (dispatch, getState) => {
    const changes = getState().changes[projectId];

    // Get the revisions from the selected files
    const revisions = changes.data.filter(item => changes.checked[item.data.fileId]).map((item)=>item._id);

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
          title: `${response.data.files.length} files commited`,
          actions: [{
            text: 'Undo',
            action: {
              aliased: 'true',
              payload: {
                functionAlias: 'ChangesActions.deleteCommit',
                functionInputs: {
                  commitId: response.data._id,
                  projectId
                }
              }
            }
          }]
        }))
        // Get the mentions
        const mentions = parseMentions(response.data.description);
        // If mentionType: task-complete, we set the task to complete.
        mentions.forEach(mention => {
          if(mention.mentionType == 'task-complete'){
            dispatch(storeChange(`tasks.data.${mention.entityId}.data.complete`, true));
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

export function deleteCommit({commitId, projectId}) {
  return (dispatch) => {
    dispatch({
      type: 'CHANGES/DELETE_COMMIT',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/commits/${commitId}`,
      }).then(response => {
        dispatch(fetchChanges({projectId}))
      })
    })
  }
}
