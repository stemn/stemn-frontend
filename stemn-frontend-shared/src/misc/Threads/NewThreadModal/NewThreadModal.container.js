import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import NewThreadModal from './NewThreadModal'
import { newThread } from 'stemn-shared/misc/Threads/Threads.actions'
import { newComment } from 'stemn-shared/misc/Comments/Comments.actions'
import { projectThreadRoute } from 'route-actions'
import { push } from 'react-router-redux'

const stateToProps = ({ threads }, { boardId }) => ({
  board: threads.boards[boardId],
  boardModel: `threads.boards.${boardId}`,
})

const dispatchToProps = {
  newThread,
  newComment,
  change: storeChange,
  goToThreadRoute: ({ threadId, projectId }) => push(projectThreadRoute({ threadId, projectId })),
}

const modalName = 'THREAD_NEW'
const ModalComponent = connect(stateToProps, dispatchToProps)(NewThreadModal)
registerModal(modalName, ModalComponent)
export default modalName
