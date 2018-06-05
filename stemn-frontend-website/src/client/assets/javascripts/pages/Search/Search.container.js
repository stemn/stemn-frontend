import React, { Component } from 'react'
import { connect } from 'react-redux'

import Search from './Search'

const stateToProps = () => ({})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class SearchContainer extends Component {
  render() {
    return (
      <Search { ...this.props } />
    )
  }
}
