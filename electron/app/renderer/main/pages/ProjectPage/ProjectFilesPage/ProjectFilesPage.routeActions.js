import { push } from 'react-router-redux'

export default ({projectId, fileId}) => {
  return push({
    pathname: `project/${projectId}/files/${fileId || ''}`
  })
}
