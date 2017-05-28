/**************************************************
This component will take in a model and value and
set the value to the store when the component mounts.

This is useful for initialising a new form data
section in the store.
**************************************************/

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { storeLoad } from 'stemn-shared/misc/Store/Store.actions'
import { get } from 'lodash'


const stateToProps = () => ({
})

const dispatchToProps = {
  load: storeLoad,
}

@connect(stateToProps, dispatchToProps)
export default class Form extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    model: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }
  componentWillMount() { 
    this.props.load(this.props.model, this.props.value);
  }
  render() {
    const { children } = this.props
    return (
      <div>
        { children }
      </div>
    )
  }
}
