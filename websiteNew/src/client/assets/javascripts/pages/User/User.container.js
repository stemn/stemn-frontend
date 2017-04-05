import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { getUser } from 'stemn-shared/misc/Users/Users.actions'

import User from './User'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  currentUser: state.auth.user,
  projects: state.projects.userProjects
})

const dispatchToProps = {
  getUser,
  getUserProjects
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUser({ userId: props.params.stub })
  }
}, {
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUserProjects({ userId: props.params.stub })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserContainer extends Component {
  render() {
    return (
      <User {...this.props} />
    )
  }
}
