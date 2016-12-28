import * as ChangesActions        from '../../../renderer/main/modules/Changes/Changes.actions.js';
import * as TasksActions          from '../../../renderer/main/modules/Tasks/Tasks.actions.js';
import * as ProjectActions        from '../../../shared/actions/projects.js';
import * as NotificationsActions  from '../../../shared/modules/Notifications/Notifications.actions.js';
import { renderFileDownload }     from '../../../shared/modules/Files/Files.actions.js';

export default (store, action) => {
  
  // Actions that we process if user is the actioner
  switch (action.type) {
    case 'RENDER/RENDER_COMPLETE':
      return renderFileDownload({ 
        projectId   : action.payload.projectId, 
        fileId      : action.payload.fileId, 
        revisionId  : action.payload.revisionId, 
        provider    : action.payload.provider
      });
  }

  if (action.payload.actioner === store.getState().auth.user._id){
    return undefined;
  }
  
  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'CHANGES/FETCH_CHANGES':
      return ChangesActions.fetchChanges({ projectId : action.payload.projectId });
    case 'BOARD/FETCH_BOARDS':
      return (dispatch) => {
        action.payload.boards.map((boardId) => dispatch(TasksActions.getBoard({ boardId })));
      }
    case 'BOARD/FETCH_GROUPS':
      return (dispatch) => {
        action.payload.groups.map((groupId) => dispatch(TasksActions.getGroup({ groupId, boardId : action.payload.boardId })));
      }
    case 'BOARD/FETCH_TASKS':
      return (dispatch) => {
        action.payload.tasks.map((taskId) => dispatch(TasksActions.getTask({ taskId })));
      }
    case 'NOTIFICATIONS/TASK_COMPLETED':
      return NotificationsActions.show({
        title : `${action.payload.user.name} Completed a Task in '${action.payload.project.name}'`,
        body  : `The task '${action.payload.task.title}' was marked as complete.`
      })
    case 'PROJECT/FETCH_PROJECT':
      return ProjectActions.getProject({ projectId : action.payload.projectId });    
    default:
      return undefined;
  }
}
