import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUser } from 'stemn-shared/misc/Users/Users.actions'

import Onboarding from './Onboarding'

const stateToProps = ({ users, auth }) => ({
  user: users[auth.user._id],
  currentUser: auth.user,
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
export default class OnboardingContainer extends Component {
  render() {
    return (
      <Onboarding { ...this.props } />
    )
  }
}

