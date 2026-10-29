import React, { Component } from 'react'
import { connect } from 'react-redux'
import Security from './Security'

const stateToProps = () => ({
})

const dispatchToProps = {
}

class SecurityContainer extends Component {
  render() {
    return (
      <Security { ...this.props } />
    )
  }
}

export default connect(stateToProps, dispatchToProps)(SecurityContainer)
