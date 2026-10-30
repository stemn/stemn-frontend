import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useThread } from 'stemn-shared/api/queries/threads'
import { replace } from 'stemn-shared/routing'
import { notFound, projectThreadRoute } from 'route-actions'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

/** /threads/:threadId redirects to the thread's project page once the thread (its project) is loaded */
const ThreadContainer = ({ params }) => {
  const { threadId } = params
  const dispatch = useDispatch()
  const { data: thread, isError } = useThread(threadId)

  useEffect(() => {
    if (thread) dispatch(replace(projectThreadRoute({ threadId, projectId: thread.project._id })))
    else if (isError) dispatch(replace(notFound()))
  }, [dispatch, thread, isError, threadId])

  return <LoadingOverlay show />
}

export default ThreadContainer
