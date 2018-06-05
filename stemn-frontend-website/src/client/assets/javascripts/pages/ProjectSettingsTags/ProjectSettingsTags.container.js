import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProjectSettingsTags from './ProjectSettingsTags'
import { saveProject, removeField, addField } from 'stemn-shared/misc/Projects/Projects.actions'

const stateToProps = ({ projects }, { params }) => {
  const projectId   = params.stub
  const project     = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`

  return {
    project,
    entityModel,
  }
}

const dispatchToProps = {
  saveProject,
  removeField, 
  addField,
}

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsTagsContainer extends Component {
  render() {
    return (
      <ProjectSettingsTags { ...this.props } />
    )
  }
}
