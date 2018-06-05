import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProjectSettingsGeneral from './ProjectSettingsGeneral'
import { saveProject, confirmLinkRemote, confirmDeleteProject } from 'stemn-shared/misc/Projects/Projects.actions'

const stateToProps = ({ projects, auth }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const projectModel = `projects.data.${projectId}`

  return {
    project,
    projectModel,
    auth,
  }
}

const dispatchToProps = {
  saveProject,
  confirmLinkRemote,
  confirmDeleteProject,
}

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsGeneralContainer extends Component {
  render() {
    return (
      <ProjectSettingsGeneral { ...this.props } />
    )
  }
}
