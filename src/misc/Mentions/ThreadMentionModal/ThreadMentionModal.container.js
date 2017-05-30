import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getBoards } from 'stemn-shared/misc/Threads/Threads.actions.js';
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ThreadMentionModal from './ThreadMentionModal'

import { get } from 'lodash'


function mapStateToProps({ threads, mentions }, { projectId, cacheKey }) {
  const projectBoards = threads.projects && threads.projects[projectId] ? threads.projects[projectId].boards : null;
  const board = projectBoards ? threads.boards[projectBoards[0]] : {};
  return {
    threads: threads.data,
    board: board,
    boardModel: board && board.data && board.data._id ? `threads.boards.${board.data._id}` : '',
    mentions: get(mentions, cacheKey, {}),
    mentionsModel: `mentions.${cacheKey}`,
  };
}

const mapDispatchToProps = {
  storeChange,
  getBoards,
}

export default (modalName) => {
  const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(ThreadMentionModal)
  registerModal(modalName, ModalComponent)
  return modalName
}
