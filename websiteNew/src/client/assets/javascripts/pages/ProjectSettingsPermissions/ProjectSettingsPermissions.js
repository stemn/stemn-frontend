import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio'
import LicenseSettings from 'stemn-shared/misc/ProjectSettings/LicenseSettings'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export default class ProjectSettingsPermissions extends Component {
  render() {
    const { project, projectModel, saveProject } = this.props
    return (
      <div>
        <InfoPanel>
          <h3>Project Type</h3>
          <ProjectPermissionsRadio
            model={ `${projectModel}.data.permissions.projectType` }
            value={ get(project, 'data.permissions.projectType', '') }
          />
        </InfoPanel>
        <InfoPanel>
          <LicenseSettings
            model={ `${projectModel}.data.license` }
            value={ get(project, 'data.license', '') }
          />
        </InfoPanel>
      </div>
    )
  }
}
