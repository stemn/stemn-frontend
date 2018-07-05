import { connect } from 'react-redux'
import MyProjectsPanel from './MyProjectsPanel'
import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import ProjectNewModalName from 'stemn-shared/misc/Projects/ProjectNewModal'

const stateToProps = ({ projects, auth }) => ({
  projects: projects.userProjects[auth.user._id] || {},
  user: auth.user,
})

const dispatchToProps = {
  getUserProjects,
  newProject: () => showModal({ modalType: ProjectNewModalName }),
}

export default connect(stateToProps, dispatchToProps)(MyProjectsPanel)
