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
  
  const cacheKey = `${params.stub}-${filter.object.type}-${page}`
  const queryKey = `${params.stub}-${page}-${JSON.stringify(filter.object)}`

  return {
    project: projects.data[params.stub],
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
      types: props.filter.object.type ? [ props.filter.object.type ] : undefined,
      cacheKey: props.cacheKey,
      criteria: {
        owner: props.filter.object.user,
        name: props.filter.object.query && `/${props.filter.object.query}/i`
      },
      page: props.page,
      size: props.size,
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectPipelinesContainer extends Component {
  render() {
    return (
      <ProjectPipelines {...this.props} />
    );
  }
}
