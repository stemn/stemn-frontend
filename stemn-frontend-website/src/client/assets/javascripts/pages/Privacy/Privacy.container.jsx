import React, { Component } from 'react'
import { connect } from 'react-redux'
import Privacy from './Privacy'

const stateToProps = () => ({})

const dispatchToProps = {}

class PrivacyContainer extends Component {
  render() {
    return <Privacy {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(PrivacyContainer)
