import React, { Component } from 'react'
import { connect } from 'react-redux'
import Features from './Features'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class FeaturesContainer extends Component {
  render() {
    return (
      <Features {...this.props} />
    );
  }
}
