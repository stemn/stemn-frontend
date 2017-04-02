import React, { Component, PropTypes } from 'react';

import TasksSettings from 'stemn-shared/misc/ProjectSettings/TasksSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

class ProjectSettingsTasks extends Component {
  render() {
    const { boardModel, updateBoard, board } = this.props;
    return (
      <InfoPanel>
        <TasksSettings
          boardModel={ boardModel }
          board={ board }
          updateBoard={ updateBoard }
        />
      </InfoPanel>
    )
  }
}

export default ProjectSettingsTasks;
