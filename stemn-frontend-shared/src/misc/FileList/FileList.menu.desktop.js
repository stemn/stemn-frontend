import * as SystemActions    from 'stemn-shared/desktop/System/System.actions.js'
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { projectFolderRoute }      from 'route-actions'
import capitalizeFirstLetter from 'stemn-shared/utils/strings/capitalizeFirstLetter'

export default (dispatch, provider) => [{
  label: 'Open Preview Window',
  isHidden: item => item.type !== 'file',
  onClick: item => dispatch(ElectronWindowsActions.create({
    type: 'PREVIEW',
    props: {
      fileId: item.fileId,
      revisionId: item.revisionId,
      projectId: item.project._id,
    },
  })),
}, {
  label: 'Open File',
  isHidden: item => item.type !== 'file',
  onClick: item => dispatch(SystemActions.openFile({
    path: item.path,
    projectId: item.project._id,
    provider: item.provider,
  })),
}, {
  label: 'Open Containing Folder',
  isHidden: item => item.type !== 'file',
  onClick: item => dispatch(SystemActions.openFile({
    location: true,
    path: item.path,
    projectId: item.project._id,
    provider: item.provider,
  })),
}, {
  label: 'Open Folder',
  isHidden: item => item.type === 'file',
  onClick: item => dispatch(projectFolderRoute({
    projectId: item.project._id,
    fileId: item.fileId,
  })),
}, {
  label: 'Open in File Explorer',
  isHidden: item => item.type === 'file',
  onClick: item => dispatch(SystemActions.openFile({
    path: item.path,
    projectId: item.project._id,
    provider: item.provider,
  })),
}, {
  divider: true,
  label: `Open on ${capitalizeFirstLetter(provider)}`,
  onClick: item => dispatch(SystemActions.openExternal({
    url: item.url,
  })),
}]
