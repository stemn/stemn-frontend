import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useComment, useDeleteComment, useToggleReaction, useUpdateComment } from 'stemn-shared/api/queries/comments'
import confirmAuth from 'stemn-shared/misc/Auth/actions/confirmAuth'
import { showConfirm } from 'stemn-shared/misc/Modal/Modal.actions.js'
import Comment from './Comment'

/**
 * A comment of a thread timeline (website thread page, thread modal on both apps). Server state is
 * the `comments.detail` query (batched: a timeline loads its comments in one request); the edit form
 * is local state.
 */
const CommentContainer = ({ commentId, timelineCacheKey, ...props }) => {
  const dispatch = useDispatch()
  const query = useComment(commentId)
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const toggleReaction = useToggleReaction()
  const [form, setForm] = useState(undefined)

  const data = query.data
  const comment = data && {
    data,
    loading: query.isFetching,
    editActive: Boolean(form),
    form,
    savePending: updateComment.isPending,
    deletePending: deleteComment.isPending,
  }

  return (
    <Comment
      {...props}
      commentId={commentId}
      comment={comment}
      startEdit={() => setForm({ body: data.body })}
      finishEdit={() => setForm(undefined)}
      changeBody={(body) => setForm({ body })}
      updateComment={() =>
        updateComment.mutate({ comment: data, body: form.body }, { onSuccess: () => setForm(undefined) })
      }
      confirmDelete={() =>
        dispatch(showConfirm()).then(() => deleteComment.mutate({ comment: data, timelineCacheKey }))
      }
      submitReaction={(reactionType) =>
        dispatch(confirmAuth(() => toggleReaction.mutate({ comment: data, reactionType }), true))
      }
    />
  )
}

export default CommentContainer
