import { push } from 'react-router-redux'

export const projectRoute = ({projectId}) => {
  return push({
    pathname: `project/${projectId}`
  })
}
export const projectFolderRoute = ({projectId, fileId}) => {
  return push({
    pathname: `project/${projectId}/files/${fileId || ''}`
  })
}
