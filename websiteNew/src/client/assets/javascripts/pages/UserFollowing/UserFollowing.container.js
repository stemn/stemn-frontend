import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserFollowing } from 'stemn-shared/misc/Projects/Projects.actions.js'

import UserFollowing from './UserFollowing'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  projects: state.projects.userProjects
})

const dispatchToProps = {}

const fetchConfigs = []

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserFollowingContainer extends Component {
  render() {
    return (
      <UserFollowing {...this.props} />
    )
  }
}
