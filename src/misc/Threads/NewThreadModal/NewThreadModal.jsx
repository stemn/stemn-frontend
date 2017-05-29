import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import classes from './NewThreadModal.scss'
import classNames from 'classnames'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Editor from 'stemn-shared/misc/Editor/EditorNew';
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

export default class NewThreadModal extends Component {
  newThread = () => {
    const { newTask, newComment, modalConfirm, change, board, boardModel, goToTaskRoute } = this.props;
    const group = get(board, 'newThread.group', board.data.groups[0]._id)
    const name = get(board, 'newThread.name')
    const body = get(board, 'newThread.body')
    const boardId = board.data._id
    const projectId = board.data.project

    // Create the new task
    newTask({
      boardId,
      task: {
        name,
        group,
        boardId,
      },
    }).then((response) => {
      // After the task is created,
      // create a comment if there is a body.
      // Close the modal when complete
      const taskId = response.value.data._id
      if (body && body.length > 1) {
        newComment({
          comment: {
            task: taskId,
            body,
          }
        }).then(() => {
          // Clear the data and close the modal
          change(`${boardModel}.newThread`, {})
          modalConfirm()
          goToTaskRoute({
            taskId,
            projectId,
          })
        })
      } else {
        // Clear the data and close the modal
        change(`${boardModel}.newThread`, {})
        modalConfirm()
        goToTaskRoute({
          taskId,
          projectId,
        })
      }
    })

  }
  render() {
    const { modalConfirm, board, boardModel } = this.props

    const groupOptions = board.data.groups.map(group => ({
      value: group._id,
      name: group.name,
    }))

    return (
      <div className={ classNames(classes.modal, 'layout-column') }>
        <div className={ classes.modalTitle }>Create a new thread</div>
        <div className={ classNames(classes.modalBody, 'flex') }>
          <div className={ classNames(classes.titleSection, 'layout-row layout-align-start-center') }>
            <Textarea
              model={ `${boardModel}.newThread.name` }
              value={ get(board, 'newThread.name', '') }
              className="text-title-4 input-plain flex"
              placeholder="Untitled Thread"
              autoFocus
              tabIndex="1"
            />
            <PopoverDropdown
              options={ groupOptions }
              value={ get(board, 'newThread.group', board.data.groups[0]._id) }
              model={ `${boardModel}.newThread.group` }
            >
              Group:&nbsp;
            </PopoverDropdown>
          </div>
          <div className={ classes.bodySection }>
            <Editor
              model={ `${boardModel}.newThread.body` }
              value={ get(board, 'newThread.body') }
              placeholder="Thread description"
              tabIndex="2"
            />
          </div>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button
            style={ { marginRight: '10px' } }
            onClick={ modalConfirm }
            tabIndex="3"
          >
            Cancel
          </Button>
          <Button
            className="primary"
            onClick={ this.newThread }
            tabIndex="4"
          >
            Create
          </Button>
        </div>
      </div>
    )
  }
}
