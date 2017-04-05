import { projectFolderRoute } from 'route-actions';
import { push } from 'react-router-redux';

export default (dispatch) => {
  return [{
    label: 'Open Folder',
    isHidden: item => item.type == 'file',
    onClick: item => dispatch(push(projectFolderRoute({
      projectId : item.project._id,
      fileId    : item.fileId
    })))
  }];
}
