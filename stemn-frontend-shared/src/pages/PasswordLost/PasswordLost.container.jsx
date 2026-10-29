import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestPasswordReset } from 'stemn-shared/misc/Auth/Auth.actions'
import PasswordLost from './PasswordLost'

const stateToProps = ({ auth }, { params }) => ({
  auth,
})

const dispatchToProps = {
  requestPasswordReset,
}

class PasswordLostContainer extends Component {
  render() {
    return (
      <PasswordLost { ...this.props } />
    )
  }
}

export default connect(stateToProps, dispatchToProps)(PasswordLostContainer)
