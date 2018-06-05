import React, { Component } from 'react'
import { connect } from 'react-redux'
import Footer from './Footer'

import { logout } from 'stemn-shared/misc/Auth/Auth.actions.js'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
  logout,
}

@connect(stateToProps, dispatchToProps)
export default class FooterContainer extends Component {
  render() {
    return (
      <Footer { ...this.props } />
    )
  }
}
