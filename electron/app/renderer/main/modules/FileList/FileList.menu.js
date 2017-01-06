import * as SystemActions    from 'electron/app/shared/modules/System/System.actions.js';
import * as ElectronWindowsActions from 'electron/app/shared/modules/ElectronWindows/ElectronWindows.actions.js';
import ProjectFilesPageRoute from 'electron/app/renderer/main/pages/ProjectPage/ProjectFilesPage/ProjectFilesPage.routeActions.js';

export default (dispatch) => {
  return [{
    label: 'Open Preview Window',
    isHidden: item => item.type != 'file',
    onClick: item => dispatch(ElectronWindowsActions.create({
      type: 'PREVIEW',
      props: {
        fileId     : item.fileId,
        revisionId : item.revisionId,
        projectId  : item.project._id,
      }
    }))
  },{
    label: 'Open File',
    isHidden: item => item.type != 'file',
    onClick: item => dispatch(SystemActions.openFile({
      path      : item.path,
      projectId : item.project._id,
      provider  : item.provider
    }))
  },{
    label: 'Open Containing Folder',
    isHidden: item => item.type != 'file',
    onClick: item => dispatch(SystemActions.openFile({
      location  : true,
      path      : item.path,
      projectId : item.project._id,
      provider  : item.provider
    }))
  },{
    label: 'Open Folder',
    isHidden: item => item.type == 'file',
    onClick: item => dispatch(ProjectFilesPageRoute({
      projectId : item.project._id,
      fileId    : item.fileId
    }))
  },{
    label: 'Open in File Explorer',
    isHidden: item => item.type == 'file',
    onClick: item => dispatch(SystemActions.openFile({
      path      : item.path,
      projectId : item.project._id,
      provider  : item.provider
    }))
  }];
}
