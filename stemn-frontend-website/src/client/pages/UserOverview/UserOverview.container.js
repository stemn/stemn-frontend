import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { getHistory } from 'stemn-shared/misc/History/History.actions'
import UserOverview from './UserOverview'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

const stateToProps = ({ users, projects, history, syncTimeline }, { params, location }) => {
  const size = 20
  const page = location.query.page || 1
  const historyCacheKey = `users-${params.stub}`
  const timelineCacheKey = `users-${params.stub}-${page}`
  return {
    size,
    page,
    historyCacheKey,
    history: history[historyCacheKey],
    user: users[params.stub],
    projects: projects.userProjects[params.stub] || {},
    timeline: get(syncTimeline, [timelineCacheKey], {}),
    timelineCacheKey,
  }
}

const dispatchToProps = {
  getHistory,
  fetchTimeline,
}

const fetchConfigs = [{
  hasChanged: 'historyCacheKey',
  onChange: (props) => {
    props.getHistory({
      entityType: 'user',
      entityId: props.params.stub,
      cacheKey: props.historyCacheKey,
    })
  },
}, {
  hasChanged: 'timelineCacheKey',
  onChange: (props) => {
    props.fetchTimeline({
      entityId: props.params.stub,
      entityType: 'user',
      size: props.size,
      page: props.page,
      cacheKey: props.timelineCacheKey,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserOverviewContainer extends Component {
  render() {
    return (
      <UserOverview { ...this.props } />
    )
  }
}
