import React, { Component } from 'react'
import { connect } from 'react-redux'
import Flow from './Flow'

const stateToProps = () => ({})

const dispatchToProps = {}

class FlowContainer extends Component {
  render() {
    return <Flow {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(FlowContainer)
