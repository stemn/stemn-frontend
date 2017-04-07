import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserFollowers } from 'stemn-shared/misc/UserFollowers/UserFollowers.actions.js'

import UserFollowers from './UserFollowers'

const stateToProps = (state, { params, location }) => ({
  followers: state.userFollowers[params.stub],
  page: location.query.page,
  pageId: `${params.stub}-${location.query.page}`,
  size: 30,
  user: state.users[params.stub],
})

const dispatchToProps = {
  getUserFollowers
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUserFollowers({
      userId: props.params.stub,
      page: props.page,
      size: props.size
    })
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
