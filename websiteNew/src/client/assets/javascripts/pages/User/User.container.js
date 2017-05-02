import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { getUser } from 'stemn-shared/misc/Users/Users.actions'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

import User from './User'

const stateToProps = ({ users, auth, projects, syncTimeline }, { params }) => ({
  user: users[params.stub],
  currentUser: auth.user,
  projects: projects.userProjects[params.stub] || {},
  timeline: get(syncTimeline, [params.stub, 'data'], []),
})

const dispatchToProps = {
  getUser,
  getUserProjects,
  fetchTimeline,
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUser({
      userId: props.params.stub,
      force: true
    })
  }
},{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUserProjects({ userId: props.params.stub })
  }
},{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.fetchTimeline({
      entityId: props.params.stub,
      entityType: 'user'
    })
  }
},]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserContainer extends Component {
  render() {
    return (
      <User {...this.props} />
    )
  }
}
