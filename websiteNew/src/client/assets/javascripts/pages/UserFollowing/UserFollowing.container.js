import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserFollowing } from 'stemn-shared/misc/UserFollowing/UserFollowing.actions.js'

import UserFollowing from './UserFollowing'

const stateToProps = (state, { params, location }) => ({
  following: state.userFollowing[params.stub],
  page: parseInt(location.query.page),
  pageId: `${params.stub}-${location.query.page}`,
  size: 30,
  user: state.users[params.stub],
})

const dispatchToProps = {
  getUserFollowing
}

const fetchConfigs = [{
  hasChanged: 'pageId',
  onChange: (props) => {
    props.getUserFollowing({
      userId: props.params.stub,
      page: props.page,
      size: props.size
    })
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
