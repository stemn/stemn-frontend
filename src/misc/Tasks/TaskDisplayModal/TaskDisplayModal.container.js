import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'

import * as TasksActions from '../Tasks.actions.js'
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'

import { has } from 'lodash'

import TaskDisplayModal from './TaskDisplayModal'


const mapStateToProps = ({ tasks, projects }, {taskId}) => {
  const task          = tasks.data[taskId];
  const board         = has(task,  'data.board')   ? tasks.boards[task.data.board]     : {};
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {};
  const boardModel    = has(task,  'data.board')   ? `tasks.boards.${task.data.board}` : '';
  const timelineCacheKey = taskId
  return {
    task,
    entityModel: `tasks.data.${taskId}`,
    board,
    boardModel,
    project,
    timelineCacheKey,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions: bindActionCreators(ModalActions, dispatch),
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    dispatch
  }
}

export default (modalName) => {
  const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(TaskDisplayModal)
  registerModal(modalName, ModalComponent)
  return modalName
}
