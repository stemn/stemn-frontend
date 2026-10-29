import React, { Component } from 'react'
import { connect } from 'react-redux'
import Footer from './Footer'

import { logout } from 'stemn-shared/misc/Auth/Auth.actions'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
  logout,
}

class FooterContainer extends Component {
  render() {
    return <Footer {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(FooterContainer)
