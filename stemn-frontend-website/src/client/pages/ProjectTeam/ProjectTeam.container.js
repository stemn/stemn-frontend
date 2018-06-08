import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectTeam from './ProjectTeam'

const stateToProps = ({ projects }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  return {
    projectId,
    project,
  }
}

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class ProjectTeamContainer extends Component {
  render() {
    return (
      <ProjectTeam { ...this.props } />
    )
  }
}
