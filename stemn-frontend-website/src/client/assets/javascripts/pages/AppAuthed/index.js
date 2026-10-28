import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'stemn-shared/routing'
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
  UNSAFE_componentWillReceiveProps(nextProps) {
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
