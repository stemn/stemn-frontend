import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import ProjectCommits from './ProjectCommits'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import { get, isEqual } from 'lodash'
import { getBoards } from 'stemn-shared/misc/Threads/Threads.actions'


const stateToProps = ({ projects, syncTimeline, stringFilter, threads }, { params, location }) => {
  const page = location.query.page || 1
  const projectId = params.stub
  const size = 60

  // Setup the filter
  const filterModel = {
    type: {
      type: 'string',
    },
    user: {
      type: 'string',
    },
    query: {
      type: 'main',
    },
  }

  const filterDefaults = {}
  const filterCacheKey = `history-${projectId}`
  const filter = stringFilter[filterCacheKey] || getFilter(filterDefaults, filterModel, location.query)
  const filterIsDefault = isEqual(filterDefaults, filter.object)

  const timelineCacheKey = `${params.stub}-${filter.object.type}-${page}`
  const timelineQueryKey = `${params.stub}-${page}-${JSON.stringify(filter.object)}`

  const boardId = get(threads, ['projects', projectId, 'boards', '0'])
  const board = get(threads, ['boards', boardId])

  return {
    project: projects.data[params.stub],
    projectId,
    syncTimeline: syncTimeline[timelineCacheKey],
    timelineCacheKey,
    timelineQueryKey,
    page,
    size,
    filter,
    filterModel,
    filterCacheKey,
    filterDefaults,
    filterIsDefault,
    board,
  }
}

const dispatchToProps = {
  fetchTimeline,
  setFilter,
  getBoards,
}

const fetchConfigs = [{
  hasChanged: 'timelineQueryKey',
  onChange: (props) => {
    props.fetchTimeline({
      entityType: 'project',
      entityId: props.projectId,
      types: props.filter.object.type ? [props.filter.object.type] : undefined,
      cacheKey: props.timelineCacheKey,
      criteria: {
        owner: props.filter.object.user,
        name: props.filter.object.query && `/${props.filter.object.query}/i`,
      },
      page: props.page,
      size: props.size,
    })
  },
}, {
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getBoards({
      projectId: props.projectId,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectCommitsContainer extends Component {
  render() {
    return (
      <ProjectCommits { ...this.props } />
    )
  }
}
