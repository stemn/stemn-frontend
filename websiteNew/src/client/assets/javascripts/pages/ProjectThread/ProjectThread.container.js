import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import ProjectThread from './ProjectThread'

import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import {
  getBoard,
  getBoards,
  getThread,
  updateThread,
} from 'stemn-shared/misc/Threads/Threads.actions'

const stateToProps = ({ tasks, projects, syncTimeline, auth }, { params }) => {
  const taskId = params.taskId;
  const task = tasks.data[taskId]
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(tasks, ['projects', projectId, 'boards', '0'])
  const board = get(tasks, ['boards', boardId])
  return {
    taskId,
    task,
    projectId,
    project,
    boardId,
    board,
    taskModel: `tasks.data.${taskId}`,
    timeline: get(syncTimeline, [taskId, 'data'], []),
    timelineCacheKey: taskId,
    currentUser: auth.user,
  };
}

const dispatchToProps = {
  getBoard,
  getBoards,
  getThread,
  updateThread,
  fetchTimeline,
};

const fetchConfigs = [{
  hasChanged: 'taskId',
  onChange: (props) => {
    props.getThread({
      taskId: props.taskId
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
  hasChanged: 'taskId',
  onChange: (props) => {
    props.fetchTimeline({
      entityId: props.taskId,
      entityType: 'task',
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
