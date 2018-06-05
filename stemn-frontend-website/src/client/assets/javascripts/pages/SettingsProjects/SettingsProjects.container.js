import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import SettingsProjects from './SettingsProjects'

const stateToProps = ({ auth, projects }) => ({
  currentUser: auth.user,
  projects: projects.userProjects[auth.user._id] || {},
})

const dispatchToProps = {
  getUserProjects,
}

const fetchConfigs = [{
  hasChanged: 'currentUser._id',
  onChange: (props) => {
    props.getUserProjects({ userId: props.currentUser._id })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class SettingsProjectsContainer extends Component {
  render() {
    return (
      <SettingsProjects { ...this.props } />
    )
  }
}
