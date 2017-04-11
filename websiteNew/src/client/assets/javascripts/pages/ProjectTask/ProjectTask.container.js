import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'

import ProjectTask from './ProjectTask';

import { getTask, getBoard, getBoards } from 'stemn-shared/misc/Tasks/Tasks.actions'

const stateToProps = ({ tasks, projects }, { params }) => {
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
    board
  };
}

const dispatchToProps = {
  getBoard,
  getBoards,
  getTask,
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
