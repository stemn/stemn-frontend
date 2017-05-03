import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import ProjectCommits from './ProjectCommits'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { createFilterString, getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'


const filterModel = {
  type: 'string',
  users: 'array',
  query: 'main',
}

const stateToProps = ({ projects, syncTimeline, stringFilter }, { params, location }) => {
  const page = location.query.page || 1
  const size = 30

  const filterDefaults = {
    type: 'all',
    query: ''
  }
  const filter = stringFilter[params.stub] || getFilter(filterDefaults, filterModel, location.query)
  const timelineCacheKey = `${params.stub}-${filter.object.type}-${page}`
  const timelineQueryKey = `${params.stub}-${page}-${JSON.stringify(filter.object)}`

  return {
    project: projects.data[params.stub],
    projectId: params.stub,
    syncTimeline: syncTimeline[timelineCacheKey],
    timelineCacheKey,
    timelineQueryKey,
    page,
    size,
    filter,
    filterModel,
  };
}
        
const dispatchToProps = {
  fetchTimeline,
  setFilter,
};

const fetchConfigs = [{
  hasChanged: 'timelineQueryKey',
  onChange: (props) => {
    props.fetchTimeline({
      entityType: 'project',
      entityId: props.projectId,
      types: [ props.filter.object.type ],
      cacheKey: props.timelineCacheKey,
      page: props.page,
      size: props.size,
    })
  }
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectCommitsContainer extends Component {
  render() {
    return (
      <ProjectCommits {...this.props} />
    );
  }
}
