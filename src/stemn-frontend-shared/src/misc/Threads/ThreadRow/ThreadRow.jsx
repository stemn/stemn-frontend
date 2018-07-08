import React, { Component } from 'react'
import classes from './ThreadRow.css'
import cn from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import DueDate from 'stemn-shared/misc/Threads/ThreadDueDate'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'
import pluralise from 'stemn-shared/utils/strings/pluralise'

const getGroupInfo = (groupId, groups) => groups.find(group => group._id === groupId)

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
        <div className={ cn('layout-row layout-align-start-center', classes.row, className) }>
          <div className="layout-column flex">
            <Link
              className={ cn(classes.title, 'text-ellipsis') }
              name="projectThreadRoute"
              params={ threadRouteParams }
            >
              { thread.data.name }
              { thread.data.threadNumber && <span className={ classes.threadNumber }>&nbsp;#T{ thread.data.threadNumber }</span> }
            </Link>
            <div className={ classes.meta }>
              { group && group.name && <span className="text-grey-2">{ group.name }</span> }
              { thread.data.due && <span className="text-interpunct" /> }
              { thread.data.due && <DueDate due={ thread.data.due } /> }
              { <span className="text-interpunct" /> }
              { <span>{ thread.data.complete ? 'Closed' : 'Open' }</span> }
              <span className="text-interpunct" />
              { pluralise(thread.data.numComments, 'Comment') }
            </div>
          </div>
          <div>
            <ThreadLabelDots
              labels={ thread.data.labels }
              labelInfo={ board.data.labels }
              name="projectThreadsRoute"
              params={ threadRouteParams }
              responsive
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
      <LoadingAnimation className={ cn('layout-row layout-align-start-center', classes.row, className) }>
        <div className="layout-column flex">
          <div>
            <LoadingPlaceholder width={ 300 } className={ classes.title } />
          </div>
          <div className={ cn(classes.meta, 'layout-row') }>
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
