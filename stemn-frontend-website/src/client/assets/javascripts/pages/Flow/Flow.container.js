import React, { Component } from 'react'
import { connect } from 'react-redux'
import Flow from './Flow'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class FlowContainer extends Component {
  render() {
    return (
      <Flow { ...this.props } />
    )
  }
}
