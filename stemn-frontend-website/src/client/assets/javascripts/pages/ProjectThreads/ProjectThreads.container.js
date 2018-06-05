import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get, omitBy, isEqual } from 'lodash'
import { getBoards } from 'stemn-shared/misc/Threads/Threads.actions'
import ProjectThreads from './ProjectThreads'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import newThreadModalName from 'stemn-shared/misc/Threads/NewThreadModal'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'
import { search } from 'stemn-shared/misc/Search/Search.actions'
import confirmAuth from 'stemn-shared/misc/Auth/actions/confirmAuth'

import isUuid from 'stemn-shared/utils/isUuid.js'

const filterModel = {
  groups: {
    type: 'array',
    validation: isUuid,
    transform: value => 'group name',
  },
  labels: {
    type: 'array',
    validation: isUuid,
    transform: value => 'label name',
  },
  user: {
    type: 'string',
    validation: isUuid,
  },
  status: {
    type: 'string',
    validation: () => true,
  },
  query: {
    type: 'main',
    validation: () => true,
  },
}


const stateToProps = ({ projects, threads, search, stringFilter }, { params, location }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(threads, ['projects', projectId, 'boards', '0'])
  const board = get(threads, ['boards', boardId])

  const page = location.query.page || 1
  const size = 30

  const filterDefaults = {
    status: 'open',
  }
  const filterCacheKey = `threads-${projectId}`
  const filter = stringFilter[filterCacheKey] || getFilter(filterDefaults, filterModel, location.query)
  const filterIsDefault = isEqual(filterDefaults, filter.object)

  const searchCacheKey = `threads-${projectId}-${page}`
  const searchQueryKey = `${params.stub}-${page}-${JSON.stringify(filter.object)}`


  return {
    page,
    size,
    threads: get(search, ['data', searchCacheKey], {}),
    projectId,
    project,
    boardId,
    board,
    boardModel: `threads.boards.${boardId}`,
    searchQueryKey,
    searchCacheKey,
    filter,
    filterModel,
    filterCacheKey,
    filterStorePath: `stringFilter.${filterCacheKey}`,
    filterIsDefault,
    filterDefaults,
  }
}

const dispatchToProps = {
  getBoards,
  showNewThreadModal: modalProps => confirmAuth(() => showModal({
    modalType: newThreadModalName,
    modalProps,
    modalOptions: {
      noClickClose: true,
    },
  })),
  setFilter,
  search,
}

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getBoards({
      projectId: props.projectId,
    })
  },
}, {
  hasChanged: 'searchQueryKey',
  onChange: (props) => {
    const parseCompleted = (status) => {
      if (status === 'closed') {
        return true
      } else if (status === 'open') {
        return false
      }
      return undefined
    }
    // Create the criteria object
    const criteria = {
      group: props.filter.object.groups,
      labels: props.filter.object.labels,
      name: props.filter.object.query && `/${props.filter.object.query}/i`,
      complete: parseCompleted(props.filter.object.status),
      users: props.filter.object.user && [props.filter.object.user],
    }

    props.search({
      entityType: 'thread',
      parentType: 'project',
      parentId: props.projectId,
      select: ['_id'],
      cacheKey: props.searchCacheKey,
      criteria: omitBy(criteria, item => item === ''),
      size: props.size,
      page: props.page,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectThreadsContainer extends Component {
  render() {
    return (
      <ProjectThreads { ...this.props } />
    )
  }
}
