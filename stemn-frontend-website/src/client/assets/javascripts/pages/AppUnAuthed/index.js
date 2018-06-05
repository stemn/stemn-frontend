import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { bindActionCreators } from 'redux'

const stateToProps = ({ auth }) => ({
  authToken: auth.authToken,
  userId: auth.user._id,
})

const dispatchToProps = {
  goHome: () => replace('/'),
}

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.authToken && nextProps.userId) {
      nextProps.goHome()
    }
  }
  componentDidMount() {
    if (this.props.authToken && this.props.userId) {
      this.props.goHome()
    }
  }
  render() {
    return this.props.children
  }
}
