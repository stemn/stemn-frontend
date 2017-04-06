import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserFollowers } from 'stemn-shared/misc/UserFollowers/UserFollowers.actions.js'

import UserFollowers from './UserFollowers'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  followers: state.userFollowers[params.stub]
})

const dispatchToProps = {
  getUserFollowers
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUserFollowers({ userId: props.params.stub })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserFollowersContainer extends Component {
  render() {
    return (
      <UserFollowers {...this.props} />
    )
  }
}
