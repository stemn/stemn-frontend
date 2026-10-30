import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'
import { useProject } from 'stemn-shared/api/queries/projects'
import { useDeleteThread, useThread, useUpdateThread } from 'stemn-shared/api/queries/threads'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import { push as pushRoute, replace as replaceRoute } from 'stemn-shared/routing'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import { getBoards } from 'stemn-shared/misc/Threads/Threads.actions'
import ProjectThread from './ProjectThread'

const emptyTimeline = []

/**
 * The thread page. The thread and the project are TanStack Query (live through the websocket
 * invalidations of the thread room); the board (groups, labels) and the timeline are still Redux.
 */
const ProjectThreadContainer = (props) => {
  const { params } = props
  const { threadId, stub: projectId } = params
  const dispatch = useDispatch()

  const threadQuery = useThread(threadId)
  const projectQuery = useProject(projectId)
  const updateThread = useUpdateThread(threadId)
  const deleteThread = useDeleteThread()

  const boardId = useSelector(({ threads }) => get(threads, ['projects', projectId, 'boards', '0']))
  const board = useSelector(({ threads }) => get(threads, ['boards', boardId]))
  const timeline = useSelector(({ syncTimeline }) => get(syncTimeline, [threadId, 'data'], emptyTimeline))
  const currentUser = useSelector(({ auth }) => auth.user)

  useEffect(() => {
    dispatch(getBoards({ projectId }))
  }, [dispatch, projectId])

  useEffect(() => {
    dispatch(fetchTimeline({ entityId: threadId, size: 500, entityType: 'thread' }))
    dispatch(joinRoom({ type: 'thread', room: threadId }))
    return () => dispatch(leaveRoom({ type: 'thread', room: threadId }))
  }, [dispatch, threadId])

  return (
    <ProjectThread
      {...props}
      threadId={threadId}
      thread={toLegacyEntity(threadQuery)}
      projectId={projectId}
      project={toLegacyEntity(projectQuery)}
      boardId={boardId}
      board={board}
      timeline={timeline}
      timelineCacheKey={threadId}
      currentUser={currentUser}
      updateThread={(changes) => updateThread.mutate({ thread: threadQuery.data, changes })}
      deleteThread={() => deleteThread.mutateAsync({ thread: threadQuery.data })}
      pushRoute={(location) => dispatch(pushRoute(location))}
      replaceRoute={(location) => dispatch(replaceRoute(location))}
    />
  )
}

export default ProjectThreadContainer
