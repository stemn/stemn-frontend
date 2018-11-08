import React, { Component } from 'react';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';
import CloudSettings from 'stemn-shared/misc/ProjectSettings/CloudSettings';
import DeleteSettings from 'stemn-shared/misc/ProjectSettings/DeleteSettings';
import { GeneralSettings } from 'stemn-shared/misc/ProjectSettings/GeneralSettings';

class ProjectSettingsGeneral extends Component {
  confirmLinkRemote = () => {
    const { project, auth } = this.props
    this.props.confirmLinkRemote({
      userId: auth.user._id,
      isConnected: project.data.remote.connected,
      projectId: project.data._id,
      provider: project.fileStoreForm.provider,
      prevProvider: project.data.remote.provider,
      fileId: project.fileStoreForm.root.fileId,
    })
  }
  confirmDeleteProject = () => {
    this.props.confirmDeleteProject({
      projectId: this.props.project.data._id,
      name: this.props.project.data.name,
    })
  }
  render() {
    const {
      project,
      projectModel,
      saveProject,
    } = this.props
    return (
      <div>
        <InfoPanel>
          <GeneralSettings
            project={ project }
            entityModel={ projectModel }
            saveProject={ saveProject }
          />
        </InfoPanel>
        <InfoPanel>
          <CloudSettings
            project={ project }
            projectModel={ projectModel }
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

export default ProjectSettingsGeneral
