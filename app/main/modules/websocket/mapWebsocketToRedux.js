import * as ChangesActions from '../../../renderer/main/modules/Changes/Changes.actions.js';
import * as TasksActions from '../../../renderer/main/modules/Tasks/Tasks.actions.js';
import * as ProjectActions from '../../../shared/actions/projects.js';

export default (store, action) => {

  // don't process the action if it was created by this user
  if (action.payload.actioner === store.getState().auth.user._id)
    return undefined;

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
    case 'PROJECT/FETCH_PROJECT':
      return ProjectActions.getProject({ projectId : action.payload.projectId });
    default:
      return undefined;
  }
}
