import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import ProjectTask from './ProjectTask'

import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { 
  getBoard, 
  getBoards, 
  getTask, 
  updateTask,
} from 'stemn-shared/misc/Tasks/Tasks.actions'

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
    currentUser: auth.user,
  };
}

const dispatchToProps = {
  getBoard,
  getBoards,
  getTask,
  updateTask,
  fetchTimeline,
};

const fetchConfigs = [{
  hasChanged: 'taskId',
  onChange: (props) => {
    props.getTask({
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
export default class ProjectTaskContainer extends Component {
  render() {
    return (
      <ProjectTask {...this.props} />
    );
  }
}
