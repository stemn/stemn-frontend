import React, { Component, PropTypes } from 'react';

import TasksSettings from 'stemn-shared/misc/ProjectSettings/TasksSettings';

export default class ProjectSettingsTasks extends Component {
  render() {
    const { boardModel, updateBoard, board } = this.props;

    return board && board.data
      ? <TasksSettings
          boardModel={ boardModel }
          board={ board }
          saveBoard={ updateBoard }
        />
      : null
  }
}
