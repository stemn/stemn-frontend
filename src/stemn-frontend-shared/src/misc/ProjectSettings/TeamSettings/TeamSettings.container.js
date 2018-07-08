import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  addTeamMember,
  changeUserPermissions,
  removeTeamMember,
  saveProject,
} from 'stemn-shared/misc/Projects/Projects.actions'

import TeamSettings from './TeamSettings'

const stateToProps = ({ projects }, { params }) => {
  const projectId   = params.stub
  const project     = projects.data[projectId]

  return {
    project,
  }
}

const dispatchToProps = {
  addTeamMember,
  changeUserPermissions,
  removeTeamMember,
  saveProject,
}

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsTeamContainer extends Component {
  render() {
    return (
      <TeamSettings { ...this.props } />
    )
  }
}
