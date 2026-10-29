import React, { Component } from 'react'
import { connect } from 'react-redux'
import Terms from './Terms'

const stateToProps = () => ({})

const dispatchToProps = {}

class TermsContainer extends Component {
  render() {
    return <Terms {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(TermsContainer)
