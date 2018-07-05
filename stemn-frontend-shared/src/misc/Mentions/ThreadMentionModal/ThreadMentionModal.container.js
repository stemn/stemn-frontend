import { connect } from 'react-redux'

import { getBoards } from 'stemn-shared/misc/Threads/Threads.actions.js'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'

import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ThreadMentionModal from './ThreadMentionModal'

import { get } from 'lodash'

const filterModel = {
  groups: {
    type: 'array',
  },
  labels: {
    type: 'array',
  },
  user: {
    type: 'string',
  },
  status: {
    type: 'string',
  },
  query: {
    type: 'main',
  },
}

function mapStateToProps({ auth, threads, mentions, stringFilter }, { projectId, cacheKey }) {
  const projectBoards = threads.projects && threads.projects[projectId] ? threads.projects[projectId].boards : null
  const board = projectBoards ? threads.boards[projectBoards[0]] : {}

  const filterCacheKey = `threads-${projectId}`
  const filter = get(stringFilter, filterCacheKey, {})

  return {
    auth,
    filter,
    filterModel,
    filterCacheKey,
    threads: threads.data,
    board,
    boardModel: board && board.data && board.data._id ? `threads.boards.${board.data._id}` : '',
    mentions: get(mentions, cacheKey, {}),
    mentionsModel: `mentions.${cacheKey}`,
  }
}

const mapDispatchToProps = {
  storeChange,
  getBoards,
  setFilter,
}

export default (modalName) => {
  const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(ThreadMentionModal)
  registerModal(modalName, ModalComponent)
  return modalName
}
