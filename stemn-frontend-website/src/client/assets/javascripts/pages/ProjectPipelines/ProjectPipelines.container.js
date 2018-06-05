import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getPipelines } from 'stemn-shared/misc/Pipelines/Pipelines.actions'
import ProjectPipelines from './ProjectPipelines'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import { get, isEqual } from 'lodash'

const stateToProps = ({ projects, pipelines, stringFilter }, { params, location }) => {
  const page = location.query.page || 1
  const projectId = params.stub
  const size = 20
  
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
  const filterCacheKey = `pipeline-${projectId}`
  const filter = stringFilter[filterCacheKey] || getFilter(filterDefaults, filterModel, location.query)
  const filterIsDefault = isEqual(filterDefaults, filter.object)
  
  const cacheKey = `${projectId}-${filter.object.type}-${page}`
  const queryKey = `${projectId}-${page}-${JSON.stringify(filter.object)}`

  return {
    project: projects.data[projectId],
    projectId,
    pipelines: pipelines.pipelines[cacheKey],
    cacheKey,
    queryKey,
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
  getPipelines,
  setFilter,
}

const fetchConfigs = [{
  hasChanged: 'queryKey',
  onChange: (props) => {
    props.getPipelines({
      projectId: props.projectId,
      cacheKey: props.cacheKey,
      criteria: {
        owner: props.filter.object.user,
        name: props.filter.object.query && `/${props.filter.object.query}/i`,
        status: props.filter.object.type,
      },
      page: props.page,
      size: props.size,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectPipelinesContainer extends Component {
  render() {
    return (
      <ProjectPipelines { ...this.props } />
    )
  }
}
