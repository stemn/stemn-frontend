import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFeed } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import Home from './Home'
import { push } from 'react-router-redux'
import { get } from 'lodash'

const stateToProps = ({ syncTimeline }, { location }) => ({
  timeline: get(syncTimeline, ['feed', 'data'], []),
  filterValue: location.query.filter || 'all'
})

const dispatchToProps = {
  getFeed,
  push,
}

const fetchConfigs = [{
  hasChanged: 'filterValue',
  onChange: (props) => {
    props.getFeed()
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class HomeContainer extends Component {
  render() {
    return (
      <Home {...this.props} />
    );
  }
}

