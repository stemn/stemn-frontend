import React, { Component } from 'react'
import { connect } from 'react-redux'
import OpenSource from './OpenSource'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class OpenSourceContainer extends Component {
  render() {
    return (
      <OpenSource { ...this.props } />
    )
  }
}
