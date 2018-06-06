import React, { Component } from 'react'
import { connect } from 'react-redux'

import SettingsBilling from './SettingsBilling'

const stateToProps = () => ({})

const dispatchToProps = {

}

@connect(stateToProps, dispatchToProps)
export default class SettingsBillingContainer extends Component {
  render() {
    return (
      <SettingsBilling { ...this.props } />
    )
  }
}
