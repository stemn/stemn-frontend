import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFeed } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import Home from './Home'
import { get } from 'lodash'

const stateToProps = ({ syncTimeline }) => ({
  timeline: get(syncTimeline, ['feed', 'data'], [])
})

const dispatchToProps = {
  getFeed,
}

@connect(stateToProps, dispatchToProps)
export default class HomeContainer extends Component {
  render() {
    return (
      <Home {...this.props} />
    );
  }
}
