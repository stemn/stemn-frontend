import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pricing from './Pricing'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class PricingContainer extends Component {
  render() {
    return (
      <Pricing { ...this.props } />
    )
  }
}
