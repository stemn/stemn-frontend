import React, { Component } from 'react'
import { get } from 'lodash'
import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio'
import LicenseSettings from 'stemn-shared/misc/ProjectSettings/LicenseSettings'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class ProjectSettingsPermissions extends Component {
  saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data,
    })
  }
  render() {
    const { project, projectModel } = this.props
    return (
      <div>
        <InfoPanel>
          <h3>Project Type</h3>
          <ProjectPermissionsRadio model={`${projectModel}.data.private`} value={get(project, 'data.private')} />
        </InfoPanel>
        <InfoPanel>
          <LicenseSettings model={`${projectModel}.data.license`} value={get(project, 'data.license', '')} />
        </InfoPanel>
        <div className="layout-row layout-align-end">
          <ProgressButton className="primary" onClick={this.saveProject} loading={project.savePending}>
            Save Project
          </ProgressButton>
        </div>
      </div>
    )
  }
}
