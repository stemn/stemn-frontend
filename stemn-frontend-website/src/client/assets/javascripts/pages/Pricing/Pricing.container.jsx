import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pricing from './Pricing'

const stateToProps = () => ({
})

const dispatchToProps = {
}

class PricingContainer extends Component {
  render() {
    return (
      <Pricing { ...this.props } />
    )
  }
}

export default connect(stateToProps, dispatchToProps)(PricingContainer)
