import * as SystemActions    from 'app/shared/actions/system';

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
      console.log(item)
    },
  }
  return [discardChanges, openFile, openFolder, preview];
}
