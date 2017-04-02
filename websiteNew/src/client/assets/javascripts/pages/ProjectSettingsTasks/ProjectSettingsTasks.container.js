import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProjectSettingsTasks from './ProjectSettingsTasks';
import TasksSettings from 'stemn-shared/misc/ProjectSettings/TasksSettings';

const stateToProps = ({tasks, projects}, {params}) => {
  const projectId = params.stub;
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  const boardModel = projectBoards ? `tasks.boards.${projectBoards[0]}` : '';
  return {
    board,
    boardModel,
  };
}

const dispatchToProps = {
  updateBoard: TasksSettings.updateBoard,
  editBoard: TasksSettings.editBoard,
};

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsTasksContainer extends Component {
  render() {
    return (
      <ProjectSettingsTasks {...this.props} />
    );
  }
}
