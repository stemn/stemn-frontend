import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProjectSettings from './ProjectSettings'

const stateToProps = ({ projects }, { params, location }) => {
  const projectId   = params.stub
  const path        = params.path || ''
  const project     = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`

  return {
    projectId,
    project,
    entityModel,
    path,
  }
}

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsContainer extends Component {
  render() {
    return (
      <ProjectSettings { ...this.props } />
    )
  }
}
