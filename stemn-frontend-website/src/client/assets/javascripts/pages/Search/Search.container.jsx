import React, { Component } from 'react'
import { connect } from 'react-redux'

import Search from './Search'

const stateToProps = () => ({})

const dispatchToProps = {
}

class SearchContainer extends Component {
  render() {
    return (
      <Search { ...this.props } />
    )
  }
}

export default connect(stateToProps, dispatchToProps)(SearchContainer)
