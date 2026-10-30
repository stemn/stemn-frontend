import React from 'react'
import { useThread } from 'stemn-shared/api/queries/threads'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import ThreadRow from './ThreadRow'

/** A row of the thread list: the batched `threads.detail` query (a page of rows is one request) */
const ThreadRowContainer = ({ threadId, ...props }) => {
  const query = useThread(threadId)
  return <ThreadRow {...props} threadId={threadId} thread={toLegacyEntity(query)} />
}

export default ThreadRowContainer
