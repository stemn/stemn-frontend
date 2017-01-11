import { fetchChanges }                 from 'stemn-shared/misc/Changes/Changes.actions.js';
import { fetchTimeline }                from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';
import { getBoard, getGroup, getTask }  from 'stemn-shared/misc/Tasks/Tasks.actions.js';
import { getProject }                   from 'stemn-shared/misc/Projects/Projects.actions.js';
import { renderFileDownload }           from 'stemn-shared/misc/Files/Files.actions.js';
//import * as NotificationsActions  from 'stemn-shared/misc/Notifications/Notifications.actions.js';
//import * as FileListActions       from 'stemn-shared/misc/FileList/FileList.actions.js';

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
    case 'PROJECT/NEW_CHANGES':
      return (dispatch) => {
          dispatch(fetchChanges({ projectId : action.payload.projectId }));
          // dispatch(FileListActions.fetchFilesGooba({ projectId : action.payload.projectId }));
      }
    case 'PROJECT/NEW_COMMITS':
      return fetchTimeline({ projectId : action.payload.projectId });
    case 'FILES/FILES_UPDATED':
      return (dispatch) => {
        action.payload.files.map((fileId) => dispatch(fetchTimeline({
            projectId : action.payload.projectId,
            provider : action.payload.provider,
            fileId
        })));
      }
    case 'BOARD/BOARDS_UPDATED':
      return (dispatch) => {
        action.payload.boards.map((boardId) => dispatch(getBoard({ boardId })));
      }
    case 'BOARD/GROUPS_UPDATED':
      return (dispatch) => {
        action.payload.groups.map((groupId) => dispatch(getGroup({ groupId, boardId : action.payload.boardId })));
      }
    case 'BOARD/TASKS_UPDATED':
      return (dispatch) => {
        action.payload.tasks.map((taskId) => dispatch(getTask({ taskId })));
      }
//    case 'BOARD/TASK_COMPLETED':
//      return NotificationsActions.show({
//        title : `${action.payload.user.name} Completed a Task in '${action.payload.project.name}'`,
//        body  : `The task '${action.payload.task.title}' was marked as complete.`
//      })
    case 'PROJECT/PROJECT_UPDATED':
      return (dispatch) => {
        return getProject({ projectId : action.payload.projectId });
      }
    default:
      return undefined;
  }
}
