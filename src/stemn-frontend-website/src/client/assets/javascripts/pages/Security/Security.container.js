import React, { Component } from 'react'
import { connect } from 'react-redux'
import Security from './Security'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class SecurityContainer extends Component {
  render() {
    return (
      <Security { ...this.props } />
    )
  }
}
