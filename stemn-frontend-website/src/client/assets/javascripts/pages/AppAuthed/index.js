import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { bindActionCreators } from 'redux'

const stateToProps = ({ auth }) => ({
  authToken: auth.authToken,
  userId: auth.user._id,
})

const dispatchToProps = {
  goLogin: () => replace('/login'),
}

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  componentWillReceiveProps(nextProps) {
    this.onMount(nextProps)
  }
  componentDidMount() {
    this.onMount(this.props)
  }
  onMount = (props) => {
    if (!props.authToken || !props.userId) {
      props.goLogin()
    }
  }
  render() {
    return this.props.children
  }
}
