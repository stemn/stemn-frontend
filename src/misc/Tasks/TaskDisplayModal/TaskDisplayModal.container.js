import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'

import { getTask, getBoard, showLabelEditModal, updateTask, toggleComplete, deleteTask } from '../Tasks.actions.js'
import { getProject } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

import { has, get } from 'lodash'

import TaskDisplayModal from './TaskDisplayModal'

const mapStateToProps = ({ syncTimeline, tasks, projects }, { taskId }) => {
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
    timeline: get(syncTimeline, [taskId, 'data'], []),
    timelineCacheKey,
  };
}

const mapDispatchToProps = {
  getProject,
  getTask,
  getBoard,
  showLabelEditModal,
  updateTask,
  toggleComplete,
  deleteTask,
  fetchTimeline,
}

const fetchConfigs = [{
  hasChanged: 'taskId',
  onChange: (props) => {
    props.getTask({
      taskId: props.taskId
    })
  }
}, {
  hasChanged: 'taskId',
  onChange: (props) => {
    props.getBoard({
      boardId: props.task.data.board
    })
  }
}, {
  hasChanged: 'taskId',
  onChange: (props) => {
    props.fetchTimeline({
      entityId: props.taskId,
      entityType: 'task',
    })
  }
}, {
  hasChanged: 'taskId',
  onChange: (props) => {
    if (!has(project, 'data')) {
      props.getProject({
        projectId: props.task.data.project._id,
      })
    }
  }
}]

export default (modalName) => {
  const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(TaskDisplayModal)
  registerModal(modalName, ModalComponent)
  return modalName
}
