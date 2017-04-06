import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUser } from 'stemn-shared/misc/Users/Users.actions'

import User from './User'

const stateToProps = (state, { userId }) => ({
  user: state.users[userId]
})

const dispatchToProps = {
  getUser
}

const fetchConfigs = [{
  hasChanged: 'userId',
  onChange: (props) => {
    props.getUser({
      userId: props.userId,
      size: 'sm'
    })
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
