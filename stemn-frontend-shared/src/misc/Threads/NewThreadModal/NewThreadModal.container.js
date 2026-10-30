import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import NewThreadModal from './NewThreadModal'
import { projectThreadRoute } from 'route-actions'
import { push } from 'stemn-shared/routing'

// The board (groups) is still Redux; the thread and its first comment are created with the
// TanStack Query mutations (NewThreadModal.jsx)
const stateToProps = ({ threads }, { boardId }) => ({
  board: threads.boards[boardId],
})

const dispatchToProps = {
  goToThreadRoute: ({ threadId, projectId }) => push(projectThreadRoute({ threadId, projectId })),
}

const modalName = 'THREAD_NEW'
const ModalComponent = connect(stateToProps, dispatchToProps)(NewThreadModal)
registerModal(modalName, ModalComponent)
export default modalName
