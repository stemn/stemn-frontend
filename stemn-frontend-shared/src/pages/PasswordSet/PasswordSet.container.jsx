import React, { Component } from 'react'
import { connect } from 'react-redux'
import { passwordUpdate } from 'stemn-shared/misc/Auth/Auth.actions'
import PasswordSet from './PasswordSet'

const stateToProps = ({ auth }, { params, location }) => ({
  auth,
  resetToken: location.query.token,
})

const dispatchToProps = {
  passwordUpdate,
}

class PasswordSetContainer extends Component {
  render() {
    return <PasswordSet {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(PasswordSetContainer)
