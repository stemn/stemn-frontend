import React, { Component, PropTypes } from 'react';

import GeneralSettings from 'stemn-shared/misc/ProjectSettings/GeneralSettings';
import CloudSettings from 'stemn-shared/misc/ProjectSettings/CloudSettings';
import DeleteSettings from 'stemn-shared/misc/ProjectSettings/DeleteSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

class ProjectSettingsGeneral extends Component {
  confirmLinkRemote = () => {
    const { project, auth } = this.props;
    this.props.confirmLinkRemote({
      userId: auth.user._id,
      isConnected: project.data.remote.connected,
      projectId: project.data._id,
      provider: project.formModels.fileStore.remote.provider,
      prevProvider: project.data.remote.provider,
      id: project.formModels.fileStore.remote.root.fileId,
      path: project.formModels.fileStore.remote.root.path,
    })
  }
  confirmDeleteProject = () => {
    this.props.confirmDeleteProject({
      projectId: this.props.project.data._id,
      name: this.props.project.data.name
    })
  }
  render() {
    const { project, entityModel, saveProject, removeField, addField } = this.props;
    return (
      <div>
        <InfoPanel>
          <GeneralSettings
            project={ project }
            entityModel={ entityModel }
            saveProject={ saveProject }
          />
        </InfoPanel>
        <InfoPanel>
          <CloudSettings
            project={ project }
            entityModel={ entityModel }
            confirmLinkRemote={ this.confirmLinkRemote }
          />
        </InfoPanel>        
        <InfoPanel>
          <DeleteSettings
            deleteProject={ this.confirmDeleteProject }
          />
        </InfoPanel>
      </div>
    )
  }
}

export default ProjectSettingsGeneral;
