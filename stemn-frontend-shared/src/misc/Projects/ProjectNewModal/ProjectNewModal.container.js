import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'

import { createProject, linkRemote } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { push } from 'react-router-redux'

import ProjectNewModal from './ProjectNewModal'
import { projectSettingsRoute } from 'route-actions'

const mapStateToProps = ({ auth, projects }) => ({
  auth,
  newProject: projects.newProject,
  entityModel: 'projects.newProject',
})

const mapDispatchToProps = {
  goToProjectSettings: ({ projectId }) => push(projectSettingsRoute({ projectId })),
  createProject,
  linkRemote,
}

const modalName = 'NEW_PROJECT'
const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(ProjectNewModal)
registerModal(modalName, ModalComponent)
export default modalName

