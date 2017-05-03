import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { getBoards } from 'stemn-shared/misc/Tasks/Tasks.actions'
import ProjectsTasks from './ProjectsTasks'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { createFilterString, getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import newThreadModalName from 'stemn-shared/misc/Threads/NewThreadModal'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'
import { search } from 'stemn-shared/misc/Search/Search.actions'

const filterModel = {
  groups: 'array',
  labels: 'array',
  users: 'array',
  open: 'bool',
  query: 'main',
}

const stateToProps = ({ projects, tasks, stringFilter }, { params, location }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(tasks, ['projects', projectId, 'boards', '0'])
  const board = get(tasks, ['boards', boardId])

  const page = location.query.page || 1
  const size = 30

  const filterDefaults = {}
  const filter = stringFilter[params.stub] || getFilter(filterDefaults, filterModel, location.query)
  const searchCacheKey = `${params.stub}-${filter.object.type}-${page}`
  const searchQueryKey = `${params.stub}-${page}-${JSON.stringify(filter.object)}`

  return {
    tasks: tasks.data,
    projectId,
    project,
    boardId,
    board,
    boardModel: `tasks.boards.${boardId}`,
  }
}

const dispatchToProps = {
  getBoards,
  showNewProjectModal: (modalProps) => showModal({
    modalType: newThreadModalName,
    modalProps: modalProps,
  }),
  setFilter,
  search,
}

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getBoards({
      projectId: props.projectId
    })
  }
},{
  hasChanged: 'searchQueryKey',
  onChange: (props) => {
    props.search({
      entityType: 'thread',
      parentType: 'project',
      parentId: props.projectId,
      select: '_id',
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectsTasksContainer extends Component {
  render() {
    return (
      <ProjectsTasks {...this.props} />
    );
  }
}
