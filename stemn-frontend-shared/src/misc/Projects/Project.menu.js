import { confirmDeleteProject } from 'stemn-shared/misc/Projects/Projects.actions.js'
import * as SystemActions from 'stemn-shared/desktop/System/System.actions.js'
import { projectSettingsRoute } from 'route-actions'
import { push } from 'react-router-redux'

export default dispatch => [{
  label: 'Open Folder',
  isHidden: item => !item.remote || !item.remote.connected,
  onClick: item => dispatch(SystemActions.openFile({
    projectId: item._id,
    provider: item.remote.provider,
    path: '',
  })),
}, {
  label: 'Project Settings',
  onClick: item => dispatch(push(projectSettingsRoute({ projectId: item._id }))),
}, {
  label: 'Delete Project',
  divider: true,
  onClick: item => dispatch(confirmDeleteProject({
    projectId: item._id,
    name: item.name,
  })),
}]
