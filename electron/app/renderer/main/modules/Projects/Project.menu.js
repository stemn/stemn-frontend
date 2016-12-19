import * as ProjectsActions from 'app/shared/actions/projects';
import * as SystemActions from 'app/shared/modules/System/System.actions.js';
import { push } from 'react-router-redux'

export default (dispatch) => {
  return [{
    label: 'Open Folder',
    isHidden: item => !item.remote || !item.remote.connected,
    onClick: item => dispatch(SystemActions.openFile({
        projectId: item._id,
        provider: item.remote.provider,
        path: ''
      })),
  },{
    label: 'Project Settings',
    onClick: item => dispatch(push(`/project/${item._id}/settings`))
  },{
    label: 'Delete Project',
    divider: true,
    onClick: item => dispatch(ProjectsActions.confirmDeleteProject({
      projectId: item._id,
      name: item.name
    })),
  }];
}
