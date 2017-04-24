
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { actions } from 'react-redux-form'
import NewThreadModal from './NewThreadModal'
import { newTask } from 'stemn-shared/misc/Tasks/Tasks.actions'
import { newComment } from 'stemn-shared/misc/Comments/Comments.actions'
import { taskRoute } from 'route-actions'
import { push } from 'react-router-redux'

const stateToProps = ({ tasks }, { boardId }) => ({
  board: tasks.boards[boardId],
  boardModel: `tasks.boards.${boardId}`,
})

const dispatchToProps = {
  newTask,
  newComment,
  change: actions.change,
  goToTaskRoute: ({ taskId, projectId }) => push(taskRoute({ taskId, projectId })),
}

const modalName = 'THREAD_NEW'

const ModalComponent = connect(stateToProps, dispatchToProps)(NewThreadModal)
registerModal(modalName, ModalComponent)

export default modalName
