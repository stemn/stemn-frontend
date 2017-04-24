
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import NewThreadModal from './NewThreadModal'

const stateToProps = ({ tasks }, { boardId }) => ({
  board: tasks.boards[boardId],
  boardModel: `tasks.boards.${boardId}`,
})

const dispatchToProps = {
}

const modalName = 'THREAD_NEW'

const ModalComponent = connect(stateToProps, dispatchToProps)(NewThreadModal)
registerModal(modalName, ModalComponent)

export default modalName
