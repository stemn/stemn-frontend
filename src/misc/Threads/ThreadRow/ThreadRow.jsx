import React, { Component, PropTypes } from 'react'
import classes from './ThreadRow.css'
import classNames from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'
import MdChatBubble from 'react-icons/md/chat-bubble-outline'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import DueDate from 'stemn-shared/misc/Threads/ThreadDueDate'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'

const getGroupInfo = (groupId, groups) => groups.find(group => group._id == groupId)

export default class ThreadRow extends Component {
  render() {
    const { board, thread, className } = this.props

    if (thread && thread.data && board && board.data && board.data.groups) {

      const threadRouteParams = {
        threadId: thread.data._id,
        projectId: board.data.project,
      }

      const group = getGroupInfo(thread.data.group, board.data.groups)

      return (
        <div className={ classNames('layout-row layout-align-start-center', classes.row, className) }>
          <div className="layout-column flex">
            <div>
              <Link
                className={ classes.title }
                name="threadRoute"
                params={ threadRouteParams }
              >
                { thread.data.name }
                { thread.data.threadNumber && <span className={ classes.threadNumber }>&nbsp;#T{ thread.data.threadNumber }</span> }
              </Link>
            </div>
            <div className={ classes.meta }>
              { group && group.name && <span className="text-grey-2">{ group.name }</span> }
              { thread.data.due && <span className="text-interpunct" /> }
              { thread.data.due && <DueDate due={ thread.data.due } /> }
            </div>
          </div>
          <div>
            <ThreadLabelDots
              labels={ thread.data.labels }
              labelInfo={ board.data.labels }
              name="projectThreadsRoute"
              params={ threadRouteParams }
              oneline
              tag
              link
            />
          </div>
          <div className={ classes.asignees }>
            <UserAvatars
              className="layout-row"
              users={ thread.data.users }
              limit={ 3 }
              shape="square"
            />
          </div>
        </div>
      )
    }
    return (
      <LoadingAnimation className={ classNames('layout-row layout-align-start-center', classes.row, className) }>
        <div className="layout-column flex">
          <div>
            <LoadingPlaceholder width={ 300 } className={ classes.title } />
          </div>
          <div className={ classNames(classes.meta, 'layout-row') }>
            <LoadingPlaceholder width={ 50 } />
            <LoadingPlaceholder width={ 50 } style={ { marginLeft: '5px' } } />
          </div>
        </div>
        <UserAvatars
          users={ [{}] }
          limit={ 3 }
          shape="square"
        />
      </LoadingAnimation>
    )
  }
}

//          <MdChatBubble className={ classes.commentsIcon } />
//          <div className={ classes.commentsNumber }>
//            { thread.data.numComments || 0 }
//          </div>
