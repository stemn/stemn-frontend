import React, { Component } from 'react'
import { connect } from 'react-redux'
import Landing from './Landing'

const stateToProps = () => ({
})

const dispatchToProps = {
}

class LandingContainer extends Component {
  render() {
    return (
      <Landing { ...this.props } />
    )
  }
}

export default connect(stateToProps, dispatchToProps)(LandingContainer)
