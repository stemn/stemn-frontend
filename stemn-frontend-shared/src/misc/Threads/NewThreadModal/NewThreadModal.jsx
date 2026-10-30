import React, { Component } from 'react'
import classes from './NewThreadModal.module.scss'
import cn from 'classnames'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import Editor from 'stemn-shared/misc/Editor/EditorNew'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import { useCreateComment } from 'stemn-shared/api/queries/comments'
import { useCreateThread } from 'stemn-shared/api/queries/threads'

class NewThreadModal extends Component {
  state = {
    name: '',
    group: undefined,
    body: '',
  }
  newThread = () => {
    const { createThread, createComment, modalConfirm, board, goToThreadRoute } = this.props
    const { name, body } = this.state
    const group = this.state.group || board.data.groups[0]._id
    const boardId = board.data._id
    const projectId = board.data.project

    // Create the new thread, then a first comment if there is a body; close the modal when complete
    createThread({ projectId, thread: { name, group, board: boardId } })
      .then((thread) =>
        body && body.length > 1 ? createComment({ threadId: thread._id, body }).then(() => thread) : thread,
      )
      .then((thread) => {
        modalConfirm()
        goToThreadRoute({ threadId: thread._id, projectId })
      })
      .catch(() => undefined) // the failure is toasted by the mutation cache; the modal stays open
  }
  render() {
    const { modalConfirm, board, savePending } = this.props
    const { name, body } = this.state
    const group = this.state.group || board.data.groups[0]._id

    const groupOptions = board.data.groups.map((group) => ({
      value: group._id,
      name: group.name,
    }))

    return (
      <div className={cn(classes.modal, 'layout-column')}>
        <div className={classes.modalTitle}>Create a new thread</div>
        <div className={cn(classes.modalBody, 'flex layout-column')}>
          <div className={cn(classes.titleSection, 'layout-row layout-align-start-center')}>
            <Textarea
              value={name}
              onChange={(event) => this.setState({ name: event.target.value })}
              className="text-title-4 input-plain flex"
              placeholder="Untitled Thread"
              autoFocus
              tabIndex="1"
            />
            <PopoverDropdown
              options={groupOptions}
              classname="light"
              value={group}
              onChange={(option) => this.setState({ group: option.value })}
            >
              Group:&nbsp;
            </PopoverDropdown>
          </div>
          <div className={classes.bodySection}>
            <Editor
              value={body}
              onChange={(value) => this.setState({ body: value })}
              placeholder="Thread description"
              tabIndex="2"
            />
          </div>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={{ marginRight: '10px' }} onClick={modalConfirm} tabIndex="3">
            Cancel
          </Button>
          <Button className="primary" onClick={this.newThread} tabIndex="4" disabled={savePending}>
            Create
          </Button>
        </div>
      </div>
    )
  }
}

/** The modal with the create mutations (thread, then its first comment) */
const NewThreadModalWithMutations = (props) => {
  const createThread = useCreateThread()
  const createComment = useCreateComment()
  return (
    <NewThreadModal
      {...props}
      createThread={createThread.mutateAsync}
      createComment={createComment.mutateAsync}
      savePending={createThread.isPending || createComment.isPending}
    />
  )
}

export default NewThreadModalWithMutations
