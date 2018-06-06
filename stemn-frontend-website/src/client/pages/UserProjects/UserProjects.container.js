import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'

import UserProjects from './UserProjects'

const stateToProps = ({ users, projects }, { params }) => ({
  user: users[params.stub],
  projects: projects.userProjects[params.stub] || {},
})

const dispatchToProps = {}

const fetchConfigs = []

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserProjectsContainer extends Component {
  render() {
    return (
      <UserProjects { ...this.props } />
    )
  }
}
