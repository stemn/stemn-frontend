import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import ThreadsSettings from './ThreadsSettings'

import { getBoards, updateBoard } from 'stemn-shared/misc/Threads/Threads.actions'

const stateToProps = ({ threads, projects }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(threads, ['projects', projectId, 'boards', '0'])
  const board = get(threads, ['boards', boardId], {})
  return {
    projectId,
    project,
    boardId,
    board,
    boardModel: `threads.boards.${boardId}`,
  }
}

const dispatchToProps = {
  updateBoard,
  getBoards,
}

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getBoards({
      projectId: props.projectId,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectSettingsThreadsContainer extends Component {
  render() {
    return (
      <ThreadsSettings { ...this.props } />
    )
  }
}
