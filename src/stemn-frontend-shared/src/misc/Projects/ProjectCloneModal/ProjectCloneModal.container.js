import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'

import { createClonedProject } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { push } from 'react-router-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

import ProjectCloneModal from './ProjectCloneModal'
import { projectRoute } from 'route-actions'

const mapStateToProps = ({ projects }, { projectId }) => ({
  projectId,
  cloneProject: projects.cloneProject,
  entityModel: 'projects.cloneProject',
})

const mapDispatchToProps = {
  goToProject: ({ projectId }) => push(projectRoute({ projectId })),
  createClonedProject,
  storeChange,
}

const modalName = 'CLONE_PROJECT'
const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(ProjectCloneModal)
registerModal(modalName, ModalComponent)
export default modalName

