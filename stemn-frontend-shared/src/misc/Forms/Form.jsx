/** ************************************************
This component will take in a model and value and
set the value to the store when the component mounts.

This is useful for initialising a new form data
section in the store.
************************************************* */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { storeLoad } from 'stemn-shared/misc/Store/Store.actions'

const stateToProps = () => ({})

const dispatchToProps = {
  load: storeLoad,
}

class Form extends Component {
  UNSAFE_componentWillMount() {
    this.props.load(this.props.model, this.props.value)
  }
  render() {
    const { children } = this.props
    return <div>{children}</div>
  }
}

export default connect(stateToProps, dispatchToProps)(Form)
