import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getBoards } from 'stemn-shared/misc/Tasks/Tasks.actions.js';
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import TaskMentionModal from './TaskMentionModal'


function mapStateToProps({ tasks, mentions }, { projectId }) {
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  return {
    tasks: tasks.data,
    board: board,
    boardModel: board && board.data && board.data._id ? `tasks.boards.${board.data._id}` : '',
    mentions: mentions.tasks[projectId] || {},
    mentionsModel: `mentions.tasks.${projectId}`,
  };
}

const mapDispatchToProps = {
  storeChange,
  getBoards,
}

export default (modalName) => {
  const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(TaskMentionModal)
  registerModal(modalName, ModalComponent)
  return modalName
}
