import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import ProjectThread from './ProjectThread'

import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import {
  deleteThread,
  getBoard,
  getBoards,
  getThread,
  updateThread,
} from 'stemn-shared/misc/Threads/Threads.actions'

const stateToProps = ({ threads, projects, syncTimeline, auth }, { params }) => {
  const threadId = params.threadId;
  const thread = threads.data[threadId]
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(threads, ['projects', projectId, 'boards', '0'])
  const board = get(threads, ['boards', boardId])
  return {
    threadId,
    thread,
    projectId,
    project,
    boardId,
    board,
    threadModel: `threads.data.${threadId}`,
    timeline: get(syncTimeline, [threadId, 'data'], []),
    timelineCacheKey: threadId,
    currentUser: auth.user,
  };
}

const dispatchToProps = {
  getBoard,
  getBoards,
  getThread,
  updateThread,
  fetchTimeline,
  deleteThread,
};

const fetchConfigs = [{
  hasChanged: 'threadId',
  onChange: (props) => {
    props.getThread({
      threadId: props.threadId
    })
  }
}, {
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getBoards({
      projectId: props.projectId
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
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectThreadContainer extends Component {
  render() {
    return (
      <ProjectThread {...this.props} />
    );
  }
}
