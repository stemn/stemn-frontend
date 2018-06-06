import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'

import { getUserFollowers } from 'stemn-shared/misc/UserFollowers/UserFollowers.actions.js'

import UserFollowers from './UserFollowers'

const stateToProps = (state, { params, location }) => {
  const size = 30
  const userId = params.stub
  const page = parseInt(location.query.page || 1)
  const items = get(state, `userFollowers.${userId}.${page}`)

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
  getUserFollowers,
}

const fetchConfigs = [{
  hasChanged: 'pageId',
  onChange: (props) => {
    props.getUserFollowers({
      userId: props.userId,
      page: props.page,
      size: props.size,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserFollowersContainer extends Component {
  render() {
    return (
      <UserFollowers { ...this.props } />
    )
  }
}
