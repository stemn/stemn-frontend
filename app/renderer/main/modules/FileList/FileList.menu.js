import * as SystemActions    from 'app/shared/modules/System/System.actions.js';
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';

export default (dispatch) => {
  const openFile = {
    label: 'Open File',
    onClick: (file)=>{
      dispatch(SystemActions.openFile({
        path      : file.path,
        projectId : file.project,
        provider  : file.provider
      }))
    },
  }
  const openFolder = {
    label: 'Open Containing Folder',
    onClick: (file)=>{
      dispatch(SystemActions.openFile({
        location  : true,
        path      : file.path,
        projectId : file.project,
        provider  : file.provider
      }))
    },
  }

  const preview = {
    label: 'Open Preview Window',
    onClick: (file)=>{
      dispatch(ElectronWindowsActions.create({
        type: 'PREVIEW',
        props: {
          fileId     : file.fileId,
          revisionId : file.revisionId,
          projectId  : file.project
        }
      }))
    },
  }
  return [preview, openFile, openFolder];
}
