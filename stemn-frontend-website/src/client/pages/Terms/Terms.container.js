import React, { Component } from 'react'
import { connect } from 'react-redux'
import Terms from './Terms'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class TermsContainer extends Component {
  render() {
    return (
      <Terms { ...this.props } />
    )
  }
}
