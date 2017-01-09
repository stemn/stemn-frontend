import * as SystemActions    from 'stemn-frontend-shared/src/desktop/System/System.actions.js';
import * as ElectronWindowsActions from 'stemn-frontend-shared/src/desktop/ElectronWindows/ElectronWindows.actions.js';

export default (dispatch) => {
  const discardChanges = {
    label: 'Discard Changes',
    onClick: (item)=>{console.log(item)},
  }
  const openFile = {
    label: 'Open File',
    onClick: (item)=>{
      dispatch(SystemActions.openFile({
        path: item.data.path,
        projectId: item.data.project._id,
        provider: item.data.provider
      }))
    },
  }
  const openFolder = {
    label: 'Open Containing Folder',
    onClick: (item)=>{
      dispatch(SystemActions.openFile({
        location: true,
        path: item.data.path,
        projectId: item.data.project._id,
        provider: item.data.provider
      }))
    },
  }

  const preview = {
    label: 'Open Preview Window',
    onClick: (item)=>{
      dispatch(ElectronWindowsActions.create({
        type: 'PREVIEW',
        props: {
          fileId: item.data.fileId,
          revisionId: item.data.revisionId,
          projectId: item.data.project._id
        }
      }))
    },
  }
  return [discardChanges, openFile, openFolder, preview];
}
