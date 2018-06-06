import React, { Component } from 'react'
import { connect } from 'react-redux'
import Landing from './Landing'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class LandingContainer extends Component {
  render() {
    return (
      <Landing { ...this.props } />
    )
  }
}
