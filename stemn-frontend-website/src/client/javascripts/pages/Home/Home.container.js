import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFeed } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import Home from './Home'
import { push, replace } from 'react-router-redux'
import { get } from 'lodash'

const stateToProps = ({ syncTimeline, auth }, { location }) => {
  const filterValue = location.query.filter || 'all'
  const page = location.query.page || 1
  const size = 60
  const feedCacheKey = `${filterValue}-${page}`

  return {
    timeline: get(syncTimeline, feedCacheKey, {}),
    filterValue,
    page,
    size,
    feedCacheKey,
    isLoggedIn: auth.authToken && auth.user._id,
  }
}

const dispatchToProps = {
  getFeed,
  push,
  replace,
}

const fetchConfigs = [{
  hasChanged: 'feedCacheKey',
  onChange: (props) => {
    if (props.isLoggedIn) {
      props.getFeed({
        feedType: props.filterValue,
        page: props.page,
        size: props.size,
        cacheKey: props.feedCacheKey,
      })
    }
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class HomeContainer extends Component {
  render() {
    const { isLoggedIn } = this.props
    if (isLoggedIn) {
      return <Home { ...this.props } />
    } 
    return null
  }
}

