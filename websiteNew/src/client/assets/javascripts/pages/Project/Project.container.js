import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getProject } from 'stemn-shared/misc/Projects/Projects.actions'
import { getCount } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import Project from './Project'

const stateToProps = ({ projects }, { params, location }) => ({
  projectId: params.stub,
  project: projects.data[params.stub],
  pathname: location.pathname,
})

const dispatchToProps = {
  getProject,
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getProject({
      projectId: props.projectId,
      size: 'lg',
      force: true,
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
class ProjectContainer extends Component {
  render() {
    return <Project {...this.props} />
  }
}

export default ProjectContainer
