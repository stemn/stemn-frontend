
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import NewThreadModal from './NewThreadModal'
import { newTask } from 'stemn-shared/misc/Tasks/Tasks.actions'
import { newComment } from 'stemn-shared/misc/Comments/Comments.actions'

const stateToProps = ({ tasks }, { boardId }) => ({
  board: tasks.boards[boardId],
  boardModel: `tasks.boards.${boardId}`,
})

const dispatchToProps = {
  newTask,
  newComment,
}

const modalName = 'THREAD_NEW'

const ModalComponent = connect(stateToProps, dispatchToProps)(NewThreadModal)
registerModal(modalName, ModalComponent)

export default modalName
