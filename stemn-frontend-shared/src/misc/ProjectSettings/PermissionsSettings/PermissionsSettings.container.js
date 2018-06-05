import React, { Component } from 'react'
import { connect } from 'react-redux'
import PermissionsSettings from './PermissionsSettings'
import { saveProject } from 'stemn-shared/misc/Projects/Projects.actions'

const stateToProps = ({ projects }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const projectModel = `projects.data.${projectId}`

  return {
    project,
    projectModel,
  }
}

const dispatchToProps = {
  saveProject,
}

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsPermissionsContainer extends Component {
  render() {
    return (
      <PermissionsSettings { ...this.props } />
    )
  }
}
