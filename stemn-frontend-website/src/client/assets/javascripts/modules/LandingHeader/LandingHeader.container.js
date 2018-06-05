import React, { Component } from 'react'
import { connect } from 'react-redux'
import LandingHeader from './LandingHeader'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class LandingHeaderContainer extends Component {
  render() {
    return (
      <LandingHeader { ...this.props } />
    )
  }
}
