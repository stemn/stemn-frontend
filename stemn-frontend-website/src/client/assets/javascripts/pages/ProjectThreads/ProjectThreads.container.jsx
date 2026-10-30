import React, { useEffect, useMemo } from 'react'
import { connect, useDispatch } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get, omitBy, isEqual } from 'lodash'
import { getBoards } from 'stemn-shared/misc/Threads/Threads.actions'
import ProjectThreads from './ProjectThreads'
import { setFilter } from 'stemn-shared/misc/StringFilter/StringFilter.actions'
import { getFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import newThreadModalName from 'stemn-shared/misc/Threads/NewThreadModal'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'
import confirmAuth from 'stemn-shared/misc/Auth/actions/confirmAuth'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { useThreadList } from 'stemn-shared/api/queries/threads'

import isUuid from 'stemn-shared/utils/isUuid.js'

const filterModel = {
  groups: {
    type: 'array',
    validation: isUuid,
    transform: (value) => 'group name',
  },
  labels: {
    type: 'array',
    validation: isUuid,
    transform: (value) => 'label name',
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

const parseCompleted = (status) => {
  if (status === 'closed') {
    return true
  } else if (status === 'open') {
    return false
  }
  return undefined
}

/** The search criteria of the filter (status, groups, labels, user, text) */
const toCriteria = (filterObject) =>
  omitBy(
    {
      group: filterObject.groups,
      labels: filterObject.labels,
      name: filterObject.query && `/${filterObject.query}/i`,
      complete: parseCompleted(filterObject.status),
      users: filterObject.user && [filterObject.user],
    },
    (item) => item === '' || item === undefined,
  )

const stateToProps = ({ projects, threads, stringFilter }, { params, location }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const boardId = get(threads, ['projects', projectId, 'boards', '0'])
  const board = get(threads, ['boards', boardId])

  const page = Number(location.query.page) || 1
  const size = 30

  const filterDefaults = {
    status: 'open',
  }
  const filterCacheKey = `threads-${projectId}`
  const filter = stringFilter[filterCacheKey] || getFilter(filterDefaults, filterModel, location.query)
  const filterIsDefault = isEqual(filterDefaults, filter.object)

  return {
    page,
    size,
    projectId,
    project,
    boardId,
    board,
    boardModel: `threads.boards.${boardId}`,
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
  showNewThreadModal: (modalProps) =>
    confirmAuth(() =>
      showModal({
        modalType: newThreadModalName,
        modalProps,
        modalOptions: {
          noClickClose: true,
        },
      }),
    ),
  setFilter,
}

const fetchConfigs = [
  {
    hasChanged: 'projectId',
    onChange: (props) => {
      props.getBoards({
        projectId: props.projectId,
      })
    },
  },
]

/**
 * The thread list. The list (thread ids for the filter and page) and the rows are TanStack Query; the
 * board (groups, labels) and the filter are still Redux. The page joins the board room, whose
 * BOARD/GROUPS_UPDATED events (threads created, moved or deleted by someone else) invalidate the list.
 */
const ProjectThreadsContainer = (props) => {
  const { projectId, page, size, filter, boardId } = props
  const dispatch = useDispatch()
  const criteria = useMemo(() => toCriteria(filter.object), [filter.object])
  const list = useThreadList({ projectId, page, size, criteria })

  useEffect(() => {
    if (!boardId) return undefined
    dispatch(joinRoom({ type: 'board', room: boardId }))
    return () => dispatch(leaveRoom({ type: 'board', room: boardId }))
  }, [dispatch, boardId])

  const threads = { data: list.data, loading: list.isFetching }
  return <ProjectThreads {...props} threads={threads} />
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(ProjectThreadsContainer))
