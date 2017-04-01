import { projectFolderRoute }      from 'route-actions';

export default (dispatch) => {
  return [{
    label: 'Open Folder',
    isHidden: item => item.type == 'file',
    onClick: item => dispatch(projectFolderRoute({
      projectId : item.project._id,
      fileId    : item.fileId
    }))
  }];
}
