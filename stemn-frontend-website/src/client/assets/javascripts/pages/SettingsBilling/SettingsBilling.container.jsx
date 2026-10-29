import React, { Component } from 'react'
import { connect } from 'react-redux'

import SettingsBilling from './SettingsBilling'

const stateToProps = () => ({})

const dispatchToProps = {}

class SettingsBillingContainer extends Component {
  render() {
    return <SettingsBilling {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(SettingsBillingContainer)
