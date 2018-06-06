import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getProject } from 'stemn-shared/misc/Projects/Projects.actions'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import Project from './Project'
import { notFound } from 'route-actions'
import { replace } from 'react-router-redux'

const stateToProps = ({ projects }, { params, location }) => ({
  projectId: params.stub,
  project: projects.data[params.stub],
  pathname: location.pathname,
})

const dispatchToProps = {
  getProject,
  joinRoom,
  leaveRoom,
  replace,
}

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getProject({
      projectId: props.projectId,
      size: 'lg',
      force: true,
    }).catch(() => props.replace(notFound()))
    props.joinRoom({
      room: props.projectId,
      type: 'project',
    })
  },
}, {
  // Leave the project room on unmount/change
  unmount: true,
  hasChanged: 'projectId',
  onChange: (nextProps, prevProps) => {
    // We leave the prevRoom if there is a prev threadId
    if (prevProps.leaveRoom && prevProps.projectId) {
      prevProps.leaveRoom({
        type: 'project',
        room: prevProps.projectId,
      })
    }
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
class ProjectContainer extends Component {
  render() {
    return <Project { ...this.props } />
  }
}

export default ProjectContainer
