import { fetchChanges }                 from 'stemn-shared/misc/Changes/Changes.actions.js';
import { fetchTimeline }                from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';
import { getBoard, getGroup, getTask }  from 'stemn-shared/misc/Tasks/Tasks.actions.js';
import { getComment }                   from 'stemn-shared/misc/Comments/Comments.actions.js';
import { getProject, getUserProjects }  from 'stemn-shared/misc/Projects/Projects.actions.js';
import { renderFileDownload,
         renderFileError,
         renderFileProgress }           from 'stemn-shared/misc/Files/Files.actions.js';
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
        provider    : action.payload.provider,
        timestamp   : action.payload.timestamp,
      });
    case 'RENDER/RENDER_FAILED':
      return renderFileError({
        fileId     : action.payload.fileId,
        revisionId : action.payload.revisionId,
        error      : action.payload.error,
      });
    case 'RENDER/RENDER_PROGRESS':
      return renderFileProgress({
        renderId   : action.payload.roomId,
        message    : action.payload.message
      });
    case 'FILES/FILES_UPDATED':
      return (dispatch) => {
        action.payload.files.map((fileId) => dispatch(fetchTimeline({
            entityType: 'project',
            provider: action.payload.provider,
            entityId: fileId
        })));
      }
    // case 'DROPBOX/ACCEPT_PENDING_SHARE_FAILED':
    //   return TODOrenderFailedErrorHandler({ // TODO: david implement this action handler. available params below. reasons list at https://trello.com/c/bJ7bCkNm/269-dropbox-accept-pending-share-failed-popup-to-explain-why-project-couldn-t-be-shared-with-user
    //     projectId : app.core.utils.pickId(data.projectId),
    //     memberId : app.core.utils.pickId(data.memberId),
    //     reason : app.core.utils.pickId(data.reason),
    //     actioner : app.core.utils.pickId(data.actioner)
    //   });
  }

  if (action.payload.actioner === store.getState().auth.user._id){
    return undefined;
  }

  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'PROJECT/ADDED_TO_PROJECT':
      return (dispatch) => {
          return getUserProjects({ userId : store.getState().auth.user._id });
      }
    case 'PROJECT/PROJECT_UPDATED':
      return getProject({ projectId : action.payload.projectId });
    case 'PROJECT/NEW_CHANGES':
      return (dispatch) => {
          dispatch(fetchChanges({ projectId : action.payload.projectId }));
          // dispatch(FileListActions.fetchFilesGooba({ projectId : action.payload.projectId }));
      }
    case 'PROJECT/NEW_COMMITS':
      return (dispatch) => {
        dispatch(fetchTimeline({
          entityType: 'project',
          entityId: action.payload.projectId
        })); // TODO: add commit type to timeline?
        dispatch(fetchChanges({ projectId : action.payload.projectId }));
      }
    case 'BOARD/BOARD_UPDATED':
      return getBoard({ boardId : action.payload.boardId });
    case 'BOARD/GROUPS_UPDATED':
      return (dispatch) => {
        action.payload.groups.map((groupId) => dispatch(getGroup({ groupId, boardId : action.payload.boardId })));
      }
    case 'BOARD/TASKS_UPDATED':
      return (dispatch) => {
        action.payload.tasks.map((taskId) => dispatch(getTask({ taskId })));
      }
    case 'BOARD/TASK_COMPLETED_UPDATED':
      return (dispatch) => {
        dispatch(getTask({ taskId : action.payload.taskId }));
        // return NotificationsActions.show({
        //   title : `${action.payload.user.name} Completed a Task in '${action.payload.project.name}'`,
        //   body  : `The task '${action.payload.task.title}' was marked as complete.`
        // });
      }
    case 'BOARD/COMMENTS_UPDATED':
      return (dispatch) => {
        action.payload.comments.map((commentId) => dispatch(getComment({ commentId })));
      }
    default:
      return undefined;
  }
}
