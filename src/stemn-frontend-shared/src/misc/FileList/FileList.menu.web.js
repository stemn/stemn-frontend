import { projectFolderRoute } from 'route-actions'
import { push } from 'react-router-redux'
import capitalizeFirstLetter from 'stemn-shared/utils/strings/capitalizeFirstLetter'

export default (dispatch, provider) => [{
  label: 'Open Folder',
  isHidden: item => item.type === 'file',
  onClick: item => dispatch(push(projectFolderRoute({
    projectId: item.project._id,
    fileId: item.fileId,
  }))),
}, {
  divider: true,
  label: `Open on ${capitalizeFirstLetter(provider)}`,
  isHidden: item => item.type !== 'file',
  onClick: item => dispatch(SystemActions.openExternal({
    url: item.url,
  })),
}]
