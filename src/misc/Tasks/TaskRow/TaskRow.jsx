import React, { Component, PropTypes } from 'react'
import classes from './TaskRow.css'
import classNames from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'
import MdChatBubble from 'react-icons/md/chat-bubble-outline'
import TaskLabelDots from 'stemn-shared/misc/Tasks/TaskLabelDots/TaskLabelDots.jsx'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'

export default class TaskRow extends Component {
  render() {
    const { board, task, className } = this.props
    console.log({board, task});
    if (task && task.data) {

      const taskRouteParams = {
        taskId: task.data._id,
        projectId: board.data.project,
      }

      return (
        <div className={ classNames('layout-row layout-align-start-center', classes.row, className) }>
          <div className="layout-column flex">
            <div>
              <Link
                className={ classes.title }
                name="taskRoute"
                params={ taskRouteParams }
              >
                { task.data.name }
              </Link>
            </div>
            <div className={ classes.meta }>
              T#123 - Unclassified - Due in 3 weeks
            </div>
          </div>
          <div>
            <TaskLabelDots
              labels={ task.data.labels }
              labelInfo={ board.data.labels }
              tag
            />
          </div>
          <div className={ classes.asignees }>
            <UserAvatars
              users={ task.data.users }
              limit={ 3 }
            />
          </div>
          <MdChatBubble className={ classes.commentsIcon } />
          <div className={ classes.commentsNumber }>
            { task.data.numComments || 0 }
          </div>
        </div>
      )
    }
    return null
  }
}
