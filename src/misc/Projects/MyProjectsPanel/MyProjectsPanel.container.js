import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyProjectsPanel from './MyProjectsPanel'
import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'

const stateToProps = ({ projects, auth }) => ({
  projects: projects.userProjects[auth.user._id] || {},
  user: auth.user,
})

const dispatchToProps = {
  getUserProjects
}

export default connect(stateToProps, dispatchToProps)(MyProjectsPanel)
