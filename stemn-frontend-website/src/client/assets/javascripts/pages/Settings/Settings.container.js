import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUser } from 'stemn-shared/misc/Users/Users.actions'

import Settings from './Settings'

const stateToProps = (state, { params }) => ({
  user: state.users[state.auth.user._id],
  currentUser: state.auth.user,
})

const dispatchToProps = {
  getUser,
}

const fetchConfigs = [{
  hasChanged: 'currentUser._id',
  onChange: (props) => {
    props.getUser({
      userId: props.currentUser._id,
      force: true,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class LoginContainer extends Component {
  render() {
    const { user } = this.props
    if (user && user.data) {
      return (
        <Settings { ...this.props } />
      )
    } 
    return null
  }
}
