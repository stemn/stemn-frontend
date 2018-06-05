import React, { Component } from 'react'
import { connect } from 'react-redux'
import Privacy from './Privacy'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class PrivacyContainer extends Component {
  render() {
    return (
      <Privacy { ...this.props } />
    )
  }
}
