import React, { Component } from 'react'
import { connect } from 'react-redux'
import Explore from './Explore'
import { replace } from 'react-router-redux'

const stateToProps = () => ({
})

const dispatchToProps = {
  replace,
}

@connect(stateToProps, dispatchToProps)
export default class ExploreContainer extends Component {
  render() {
    return (
      <Explore { ...this.props } />
    )
  }
}
