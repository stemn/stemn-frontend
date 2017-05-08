import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import ProjectCommits from './ProjectCommits'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { createFilterString, getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import { isEqual } from 'lodash'


const stateToProps = ({ projects, syncTimeline, stringFilter }, { params, location }) => {
  const page = location.query.page || 1
  const projectId = params.stub
  const size = 30

  // Setup the filter
  const filterModel = {
    type: 'string',
    user: 'string',
    query: 'main',
  }
  const filterDefaults = { }
  const filterCacheKey = `history-${projectId}`
  const filter = stringFilter[filterCacheKey] || getFilter(filterDefaults, filterModel, location.query)
  const filterIsDefault = isEqual(filterDefaults, filter.object)

  const timelineCacheKey = `${params.stub}-${filter.object.type}-${page}`
  const timelineQueryKey = `${params.stub}-${page}-${JSON.stringify(filter.object)}`

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
  }
}
        
const dispatchToProps = {
  fetchTimeline,
  setFilter,
}

const fetchConfigs = [{
  hasChanged: 'timelineQueryKey',
  onChange: (props) => {
    props.fetchTimeline({
      entityType: 'project',
      entityId: props.projectId,
      types: props.filter.object.type ? [ props.filter.object.type ] : undefined,
      cacheKey: props.timelineCacheKey,
      criteria: {
        owner: props.filter.object.user,
      },
      page: props.page,
      size: props.size,
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectCommitsContainer extends Component {
  render() {
    return (
      <ProjectCommits {...this.props} />
    );
  }
}
