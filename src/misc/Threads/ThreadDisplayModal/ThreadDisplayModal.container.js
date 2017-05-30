import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'

import { getThread, getBoard, showLabelEditModal, updateThread, toggleComplete, deleteThread } from '../Threads.actions.js'
import { getProject } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

import { has, get } from 'lodash'

import ThreadDisplayModal from './ThreadDisplayModal'

const mapStateToProps = ({ syncTimeline, threads, projects }, { threadId }) => {
  const thread          = threads.data[threadId];
  const board         = has(thread,  'data.board')   ? threads.boards[thread.data.board]     : {};
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {};
  const boardModel    = has(thread,  'data.board')   ? `threads.boards.${thread.data.board}` : '';
  const timelineCacheKey = threadId
  return {
    thread,
    entityModel: `threads.data.${threadId}`,
    board,
    boardModel,
    project,
    timeline: get(syncTimeline, [threadId, 'data'], []),
    timelineCacheKey,
  };
}

const mapDispatchToProps = {
  getProject,
  getThread,
  getBoard,
  showLabelEditModal,
  updateThread,
  toggleComplete,
  deleteThread,
  fetchTimeline,
}

const fetchConfigs = [{
  hasChanged: 'threadId',
  onChange: (props) => {
    props.getThread({
      threadId: props.threadId
    })
  }
}, {
  hasChanged: 'threadId',
  onChange: (props) => {
    props.getBoard({
      boardId: props.thread.data.board
    })
  }
}, {
  hasChanged: 'threadId',
  onChange: (props) => {
    props.fetchTimeline({
      entityId: props.threadId,
      entityType: 'thread',
    })
  }
}, {
  hasChanged: 'threadId',
  onChange: (props) => {
    if (!has(project, 'data')) {
      props.getProject({
        projectId: props.thread.data.project._id,
      })
    }
  }
}]

export default (modalName) => {
  const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(ThreadDisplayModal)
  registerModal(modalName, ModalComponent)
  return modalName
}
