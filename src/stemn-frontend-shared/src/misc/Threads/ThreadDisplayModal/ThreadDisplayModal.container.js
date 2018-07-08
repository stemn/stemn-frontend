import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getThread, getBoard, showLabelEditModal, updateThread, toggleComplete, deleteThread } from '../Threads.actions.js'
import { getProject } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'

import { has, get } from 'lodash'

import ThreadDisplayModal from './ThreadDisplayModal'

const mapStateToProps = ({ syncTimeline, threads, projects }, { threadId }) => {
  const thread          = threads.data[threadId]
  const board         = has(thread,  'data.board')   ? threads.boards[thread.data.board]     : {}
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {}
  const boardModel    = has(thread,  'data.board')   ? `threads.boards.${thread.data.board}` : ''
  const timelineCacheKey = threadId
  return {
    thread,
    entityModel: `threads.data.${threadId}`,
    board,
    boardModel,
    project,
    timeline: get(syncTimeline, [threadId, 'data'], []),
    timelineCacheKey,
  }
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
  joinRoom,
  leaveRoom,
}

const fetchConfigs = [{
  hasChanged: 'threadId',
  onChange: (props) => {
    props.getThread({
      threadId: props.threadId,
    })
    props.fetchTimeline({
      entityId: props.threadId,
      entityType: 'thread',
      size: 500,
    })
    props.joinRoom({
      type: 'thread',
      room: props.threadId,
    })
    if (!has(props, 'board.data')) {
      props.getBoard({
        boardId: props.thread.data.board,
      })
    }
    if (!has(props, 'project.data')) {
      props.getProject({
        projectId: props.thread.data.project._id,
      })
    }
  },
}, {
  // Leave the thread room on unmount/change
  unmount: true,
  hasChanged: 'threadId',
  onChange: (nextProps, prevProps) => {
    // We leave the prevRoom if there is a prev threadId
    if (prevProps.leaveRoom && prevProps.threadId) {
      prevProps.leaveRoom({
        type: 'thread',
        room: prevProps.threadId,
      })
    }
  },
}]

export default (modalName) => {
  const withFetchData = fetchDataHoc(fetchConfigs)(ThreadDisplayModal)
  const withRedux = connect(mapStateToProps, mapDispatchToProps)(withFetchData)
  registerModal(modalName, withRedux)
  return modalName
}
