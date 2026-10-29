import React, { Component } from 'react'
import { connect } from 'react-redux'
import LandingHeader from './LandingHeader'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {}

class LandingHeaderContainer extends Component {
  render() {
    return <LandingHeader {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(LandingHeaderContainer)
