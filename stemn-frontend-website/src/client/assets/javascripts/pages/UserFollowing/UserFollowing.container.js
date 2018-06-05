import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'

import { getUserFollowing } from 'stemn-shared/misc/UserFollowing/UserFollowing.actions.js'

import UserFollowing from './UserFollowing'

const stateToProps = (state, { params, location }) => {
  const size = 30
  const userId = params.stub
  const page = parseInt(location.query.page || 1)
  const items = get(state, `userFollowing.${userId}.${page}`)

  return {
    items,
    page,
    pageId: `${userId}-${page}`,
    size,
    user: state.users[params.stub],
    userId,
  }
}

const dispatchToProps = {
  getUserFollowing,
}

const fetchConfigs = [{
  hasChanged: 'pageId',
  onChange: (props) => {
    props.getUserFollowing({
      userId: props.userId,
      page: props.page,
      size: props.size,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserFollowingContainer extends Component {
  render() {
    return (
      <UserFollowing { ...this.props } />
    )
  }
}
