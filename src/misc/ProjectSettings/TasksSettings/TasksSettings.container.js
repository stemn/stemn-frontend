import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import TasksSettings from './TasksSettings';

import { getBoards, updateBoard } from 'stemn-shared/misc/Tasks/Tasks.actions'

const stateToProps = ({ tasks, projects }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(tasks, ['projects', projectId, 'boards', '0'])
  const board = get(tasks, ['boards', boardId], {})
  return {
    projectId,
    project,
    boardId,
    board,
    boardModel: `tasks.boards.${boardId}`
  };
}

const dispatchToProps = {
  updateBoard,
  getBoards,
};

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getBoards({
      projectId: props.projectId
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectSettingsTasksContainer extends Component {
  render() {
    return (
      <TasksSettings {...this.props} />
    );
  }
}
