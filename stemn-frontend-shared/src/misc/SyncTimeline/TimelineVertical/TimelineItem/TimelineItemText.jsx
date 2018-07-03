import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'stemn-shared/misc/Router/Link'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import UserNameFromId from 'stemn-shared/misc/Users/UserNameFromId'
import pluralise from 'stemn-shared/utils/strings/pluralise'
import { get, has } from 'lodash'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'

const eventTextMap = {
  uncompleted: (item, type, entity) => {
    const project = get(item, 'data.project')
    const commit = get(item, 'data.commit')
    const thread = get(item, 'data.thread')

    const params = {
      projectId: project._id,
      threadId: thread._id,
    }
    if (type === 'thread') {
      return <span>re-opened this thread</span>
    } 
    return (
      <span>
          re-opened the thread
        <Link name="projectThreadRoute" params={ params }>{ thread.name }</Link>
          in
        <Link name="projectRoute" params={ params }>{ project.name }</Link>
      </span>
    )
  },
  addedUsers: (item, type, entity) => (
    <span>assigned<UserNameFromId userId={ item.data.addedUsers[0] } />to this thread</span>
  ),
  removedUsers: (item, type, entity) => (
    <span>unassigned<UserNameFromId userId={ item.data.removedUsers[0] } />from this thread</span>
  ),
  revision: (item, type, entity, groupItem, groupTitle) => {
    const project = get(item, 'data.project', {})
    const params = {
      projectId: project._id,
      fileId: item.data.fileId,
      revisionId: item.data.revisionId,
    }
    if (groupItem) {
      return (
        <span>
          <Link name="fileRoute" params={ params }>{ middleConcat(item.data.name, 40, 0.6) }</Link>
          { `(Revision ${item.data.revisionNumber})` }
        </span>
      )
    } else if (groupTitle) {
      return (
        <span>
          {`added ${item.eventsGrouped.length} revisions to` }
          <Link name="projectRoute" params={ params }>{ project.name }</Link>
        </span>
      )
    } else if (type === 'file') {
      return (
        <span>
          {  !item.data.revisionNumber || item.data.revisionNumber === 0
            ? 'created this file'
            : `added revision ${item.data.revisionNumber}` }
        </span>
      )
    } 
    return (
      <span>
        { !item.data.revisionNumber || item.data.revisionNumber === 0
          ? 'created'
          : `added revision ${item.data.revisionNumber} to` }
        <Link name="fileRoute" params={ params }>{ middleConcat(item.data.name, 40, 0.6) }</Link>
          in
        <Link name="projectRoute" params={ params }>{ project.name }</Link>
      </span>
    )
  },
  thread: (item, type, entity, groupItem, groupTitle) => {
    const project = get(item, 'data.project', {})
    const params = {
      projectId: project._id,
      threadId: item._id,
    }
    if (groupItem) {
      return (
        <span>
          <Link name="projectThreadRoute" params={ params }>{ middleConcat(item.data.name, 40, 0.6) }</Link>
          { `(Task ${item.data.threadNumber})` }
        </span>
      )
    } else if (groupTitle) {
      return (
        <span>
          {`added ${item.eventsGrouped.length} new threads to` }
          <Link name="projectRoute" params={ params }>{ project.name }</Link>
        </span>
      )
    } else if (['feed', 'user'].includes(type)) {
      return (
        <span>
          added a new thread:
          <Link name="projectThreadRoute" params={ params }>{ item.data.name }</Link>
          to
          <Link name="projectRoute" params={ params }>{ project.name || 'Untitled Project' }</Link>
        </span>
      )
    }
    return (
      <span>
        added a new thread:
        <Link name="projectThreadRoute" params={ params }>{ item.data.name }</Link>
      </span>
    )
  },
  comment: (item, type, entity) => {
    const thread = get(item, 'data.thread', {})
    const project = get(item, 'data.project', {})
    const params = {
      projectId: project._id,
      threadId: thread._id,
    }
    if (['feed', 'user'].includes(type)) {
      return (
        <span>
          commented on
          <Link name="projectThreadRoute" params={ params }>{ thread.name }</Link>
          in
          <Link name="projectRoute" params={ params }>{ project.name }</Link>
        </span>
      )
    }
    return (
      <span>
          commented on
        <Link name="projectThreadRoute" params={ params }>{ thread.name }</Link>
      </span>
    )
  },  
  mention: (item, type, entity) => {    
    const locationCommit = get(item, 'data.mentionLocation.commit', {})
    const locationProject = get(item, 'data.mentionLocation.project', {})
    const locationComment = get(item, 'data.mentionLocation.comment', {})
    const locationThread = get(item, 'data.mentionLocation.thread', {})
    
    const locationParams = {
      projectId: locationProject._id,
      commitId: locationCommit._id,
      threadId: locationThread._id,
      commentId: locationComment._id,
    }

    const mentionedUser = get(item, 'data.mention.user.name')
    const mentionedItemString = mentionedUser || 'this thread'

    if (locationCommit._id) {
      return (
        <span>
          mentioned { mentionedItemString } in
          <Link name="commitRoute" params={ locationParams }>{ locationCommit.name }</Link>
        </span>
      )
    } else if (locationThread._id) {
      return (
        <span>
          mentioned { mentionedItemString } in
          <Link name="projectThreadRoute" params={ locationParams }>{ locationThread.name }</Link>
        </span>
      )
    } 
    return <span>Invalid mention format</span>
  },
  commit: (item, type, entity) => {
    const commit = get(item, 'data.commit', {})
    const project = get(item, 'data.project', {})
    const params = {
      projectId: project._id,
      commitId: commit._id,
    }
    if (type === 'file') {
      return (
        <span>
          added this file to commit:
          <Link name="commitRoute" params={ params }>{ commit.name }</Link>
        </span>
      )
    } else if (type === 'feed') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ commit.name }</Link>
          to
          <Link name="projectRoute" params={ params }>{ project.name || 'Untitled Project' }</Link>
        </span>
      )
    } else if (type === 'project' || type === 'user') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ commit.name }</Link>
          containing { pluralise(item.data.items.length, 'revision') }
        </span>
      )
    } else if (type === 'thread') {
      return (
        <span>
          referenced this thread in commit
          <Link name="commitRoute" params={ params }>{ commit.name }</Link>
        </span>
      )
    }
  },
  completed: (item, type, entity) => {
    const params = {
      projectId: get(item, 'data.project._id'),
      commitId: get(item, 'data.commit._id'),
      threadId: get(item, 'data.thread._id'),
    }
    if (type === 'thread') {
      if (get(item, 'data.commit.name')) {
        return (<span>
          marked this as closed in commit
          <Link
            className="link-primary"
            name="commitRoute"
            params={ params }
          >
            { item.data.commit.name }
          </Link>
        </span>)
      } 
      return <span>marked this as closed</span>
    } 
    return (
      <span>
          closed the thread
        <Link
          className="link-primary"
          name="projectThreadRoute"
          params={ params }
        >
          { get(item, 'data.thread.name', 'Untitled Thread') }
        </Link>
        { get(item, 'data.commmit._id') &&
        <span>
              in commit
          <Link
            className="link-primary"
            name="commitRoute"
            params={ params }
          >
            { item.data.commit.name }
          </Link>
        </span>
        }
        { get(item, 'data.project._id') &&
        <span>
              in project
          <Link
            className="link-primary"
            name="projectRoute"
            params={ params }
          >
            { item.data.project.name }
          </Link>
        </span>
        }
      </span>
    )
  },
  changedLabels: (item, type, entity) => {
    if (type === 'thread' || type === 'project') {
      const hasAddedLabels = has(item, 'data.addedLabels') && item.data.addedLabels.length > 0
      const hasRemovedLabels = has(item, 'data.removedLabels') && item.data.removedLabels.length > 0
      const params = {
        projectId: get(entity, 'data.project'),
        threadId: get(item, 'data.thread._id'),
      }
      return (
        <span>
          { hasAddedLabels &&
            <span>
              added the&nbsp;
              <ThreadLabelDots
                labels={ item.data.addedLabels }
                labelInfo={ entity.data.labels }
                tag
              />
              { pluralise(item.data.addedLabels.length, 'label', true) }
            </span>
          }
          { hasAddedLabels && hasRemovedLabels &&
            <span>&nbsp;and&nbsp;</span>
          }
          { hasRemovedLabels &&
            <span>
              removed the&nbsp;
              <ThreadLabelDots
                labels={ item.data.removedLabels }
                labelInfo={ entity.data.labels }
                tag
              />
              { pluralise(item.data.removedLabels.length, 'label', true) }
            </span>
          }
          { type === 'project' &&
            <span>
              { hasRemovedLabels ? ' from' : ' to' }
              <Link name="projectThreadRoute" params={ params }>{ get(item, 'data.thread.name', 'Untitled Thread') }</Link>
            </span>
          }
        </span>
      )
    } 
    return <span>Changed Labels</span>
  },
  movedGroup: (item, type, entity) => {
    const group1 = entity.data.groups.find(group => group._id === item.data.movedGroups[0])
    const group2 = entity.data.groups.find(group => group._id === item.data.movedGroups[1])
    const params = {
      projectId: get(item, 'data.project._id'),
      threadId: get(item, 'data.thread._id'),
    }
    const thread = type === 'thread' ? ' this thread ' : <Link name="projectThreadRoute" params={ params }>{ get(item, 'data.thread.name') }</Link>
    return (
      <span>
        moved
        { thread }
        from
        <Link name="projectThreadsRoute" params={ params } query={ { groups: [group1._id] } }>{ group1.name }</Link>
        to
        <Link name="projectThreadsRoute" params={ params } query={ { groups: [group2._id] } }>{ group2.name }</Link>
      </span>
    )
  },
}

export default class TimelineItemText extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'thread', 'project']),
    item: PropTypes.object,
    entity: PropTypes.object,
    groupItem: PropTypes.bool,
  }
  render() {
    const { item, type, entity, groupItem } = this.props
    const groupTitle = item.eventsGrouped
    return eventTextMap[item.event]
      ? eventTextMap[item.event](item, type, entity, groupItem, groupTitle)
      : <span>Unknown Event Type: { item.event }</span>
  }
}
