import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getProject } from 'stemn-shared/misc/Projects/Projects.actions'

import Project from './Project'

const stateToProps = (state, { projectId }) => ({
  project: state.projects[projectId]
})

const dispatchToProps = {
  getProject
}

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getProject({
      projectId: props.projectId,
      size: 'lg'
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectContainer extends Component {
  render() {
    return (
      <Project {...this.props} />
    )
  }
}
