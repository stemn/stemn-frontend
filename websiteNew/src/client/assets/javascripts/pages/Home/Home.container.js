import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFeed } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import Home from './Home'
import { push } from 'react-router-redux'
import { get } from 'lodash'

const stateToProps = ({ syncTimeline }, { location }) => {
  const filterValue = location.query.filter || 'all'
  return {
    timeline: get(syncTimeline, [filterValue, 'data'], []),
    filterValue,
  }
}

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

