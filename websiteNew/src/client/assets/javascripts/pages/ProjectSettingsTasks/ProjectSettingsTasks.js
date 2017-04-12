import React, { Component, PropTypes } from 'react';

import TasksSettings from 'stemn-shared/misc/ProjectSettings/TasksSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

export default class ProjectSettingsTasks extends Component {
  render() {
    const { boardModel, updateBoard, board } = this.props;

    return (
      <InfoPanel>
        { board && board.data
        ? <TasksSettings
            boardModel={ boardModel }
            board={ board }
            saveBoard={ updateBoard }
          />
        : null }
      </InfoPanel>
    )
  }
}
