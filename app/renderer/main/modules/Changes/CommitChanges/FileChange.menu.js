import * as SystemActions    from 'app/shared/actions/system';

export default (dispatch) => {
  const discardChanges = {
    label: 'Discard Changes',
    onClick: (item)=>{console.log(item)},
  }
  const openFile = {
    label: 'Open file',
    onClick: (item)=>{
      dispatch(SystemActions.openFile({
        path: item.data.path,
        project: item.data.project._id,
        provider: item.data.provider
      }))
    },
  }
  const openFolder = {
    label: 'Open containing folder',
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
    label: 'Open preview window',
    onClick: (item)=>{
      console.log(item)
    },
  }
  return [discardChanges, openFile, openFolder, preview];
}
