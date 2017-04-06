import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserFollowing } from 'stemn-shared/misc/UserFollowing/UserFollowing.actions.js'

import UserFollowing from './UserFollowing'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  followers: state.userFollowing[params.stub]
})

const dispatchToProps = {
  getUserFollowing
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUserFollowing({ userId: props.params.stub })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserFollowingContainer extends Component {
  render() {
    return (
      <UserFollowing {...this.props} />
    )
  }
}
