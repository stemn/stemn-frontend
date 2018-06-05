import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'

import { getUserStars } from 'stemn-shared/misc/UserStars/UserStars.actions.js'

import UserStars from './UserStars'

const stateToProps = (state, { params, location }) => {
  const size = 30
  const userId = params.stub
  const page = parseInt(location.query.page || 1)
  const items = get(state, `userStars.${userId}.${page}`)

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
  getUserStars,
}

const fetchConfigs = [{
  hasChanged: 'pageId',
  onChange: (props) => {
    props.getUserStars({
      userId: props.userId,
      page: props.page,
      size: props.size,
    })
  },
}]


@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserStarsContainer extends Component {
  render() {
    return (
      <UserStars { ...this.props } />
    )
  }
}
