import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import UserDetails from './UserDetails'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  projects: state.projects.userProjects[params.stub] || {},
})

const dispatchToProps = {}

const fetchConfigs = []

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserDetailsContainer extends Component {
  render() {
    return (
      <UserDetails { ...this.props } />
    )
  }
}
