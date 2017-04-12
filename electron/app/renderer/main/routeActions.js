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
export const projectSettingsRoute = ({projectId}) => {
  return push({
    pathname: `project/${projectId}/settings`
  })
}
export const homeRoute = () => {
  return push({
    pathname: `/`
  })
}
export const loginRoute = () => {
  return push({
    pathname: `/login`
  })
}

export const commitRoute = ({ projectId, commitId }) => `/project/${projectId}/feed?item=${commitId}`
