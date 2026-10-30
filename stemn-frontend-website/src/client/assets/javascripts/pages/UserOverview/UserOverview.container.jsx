import React from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { getHistory } from 'stemn-shared/misc/History/History.actions'
import UserOverview from './UserOverview'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import { useUserProjects } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'

const stateToProps = ({ users, auth, history, syncTimeline }, { params, location }) => {
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
    currentUserId: auth.user._id,
    timeline: get(syncTimeline, [timelineCacheKey], {}),
    timelineCacheKey,
  }
}

const dispatchToProps = {
  getHistory,
  fetchTimeline,
}

const fetchConfigs = [
  {
    hasChanged: 'historyCacheKey',
    onChange: (props) => {
      props.getHistory({
        entityType: 'user',
        entityId: props.params.stub,
        cacheKey: props.historyCacheKey,
      })
    },
  },
  {
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
  },
]

const UserOverviewContainer = (props) => {
  const projects = useUserProjects(props.params.stub, props.currentUserId)
  return <UserOverview {...props} projects={toLegacyEntity(projects)} />
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(UserOverviewContainer))
