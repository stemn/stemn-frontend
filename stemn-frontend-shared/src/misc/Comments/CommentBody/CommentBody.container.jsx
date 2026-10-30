import React from 'react'
import { useComment } from 'stemn-shared/api/queries/comments'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import CommentBody from './CommentBody'

/** The body of a comment (feed and file timelines): the batched `comments.detail` query */
const CommentBodyContainer = ({ commentId, ...props }) => {
  const query = useComment(commentId)
  return <CommentBody {...props} commentId={commentId} comment={toLegacyEntity(query)} />
}

export default CommentBodyContainer
