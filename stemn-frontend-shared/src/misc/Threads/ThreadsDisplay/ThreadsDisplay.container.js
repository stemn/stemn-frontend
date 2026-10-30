import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getBoards, changeLayout } from '../Threads.actions.js'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'

import { get, has } from 'lodash'
import ThreadsDisplay from './ThreadsDisplay'

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

const mapStateToProps = ({ threads, projects, stringFilter }, { projectId }) => {
  const project = projects.data[projectId]
  const projectBoards = threads.projects[projectId]

  // `board` before `boardModel`: with native const (no Babel/ES5 `var`) the old order threw a TDZ ReferenceError
  const board = projectBoards && projectBoards.boards ? threads.boards[projectBoards.boards[0]] : {}
  const boardModel = has(board, 'data._id') ? `threads.boards.${board.data._id}` : ''

  const filterCacheKey = `threads-${projectId}`
  const filter = get(stringFilter, filterCacheKey, {})

  return {
    filter,
    filterModel,
    filterCacheKey,
    threads: threads.data,
    project,
    projectBoards,
    board,
    boardModel,
  }
}

const mapDispatchToProps = {
  getBoards,
  changeLayout,
  setFilter,
}

const fetchConfigs = [
  {
    hasChanged: 'projectId',
    onChange: (props) => {
      props.getBoards({
        projectId: props.projectId,
      })
    },
  },
]

const withFetchData = fetchDataHoc(fetchConfigs)(ThreadsDisplay)
const withRedux = connect(mapStateToProps, mapDispatchToProps)(withFetchData)
export default withRedux
