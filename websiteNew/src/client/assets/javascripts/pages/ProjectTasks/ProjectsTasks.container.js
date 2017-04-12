import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'

import ProjectsTasks from './ProjectsTasks'

import {
  getBoards,
} from 'stemn-shared/misc/Tasks/Tasks.actions'


const stateToProps = ({ projects, tasks }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(tasks, ['projects', projectId, 'boards', '0'])
  const board = get(tasks, ['boards', boardId])
  return {
    tasks: tasks.data,
    projectId,
    project,
    boardId,
    board,
    boardModel: `tasks.boards.${boardId}`
  }
}

const dispatchToProps = {
  getBoards
}

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
export default class ProjectsTasksContainer extends Component {
  render() {
    return (
      <ProjectsTasks {...this.props} />
    );
  }
}


function mapStateToProps({ tasks, projects }, {projectId}) {
  const projectBoards = tasks.projects[projectId];
  const board = projectBoards && projectBoards.boards ? tasks.boards[projectBoards.boards[0]] : {};
  return {
    tasks: tasks.data,
    project: projects[projectId],
    projectBoards,
    board,
    boardModel: board && board.data && board.data._id ? `tasks.boards.${board.data._id}` : '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    dispatch
  }
}
