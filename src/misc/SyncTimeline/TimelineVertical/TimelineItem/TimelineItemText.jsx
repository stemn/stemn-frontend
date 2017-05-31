import React, { Component, PropTypes } from 'react';
import Link from 'stemn-shared/misc/Router/Link'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import pluralise from 'stemn-shared/utils/strings/pluralise'
import { get } from 'lodash'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'

const eventTextMap = {
  uncompleted: (item, type, entity) => <span>re-opened this thread</span>,
  addAsignee: (item, type, entity) => <span>was assigned to this thread</span>,
  removeAsignee : (item, type, entity) => <span>was removed from assignees</span>,
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
    } else {
      return (
        <span>
          { !item.data.revisionNumber || item.data.revisionNumber === 0
          ? 'created'
          : `added revision ${item.data.revisionNumber} to` }

        </span>
      )
    }
  },
  thread: (item, type, entity, groupItem, groupTitle) => {
    const project = get(item, 'data.project', {})
    const params = {
      projectId: project._id,
      threadId: item._id
    }
    if (groupItem) {
      return (
        <span>
          <Link name="threadRoute" params={ params }>{ middleConcat(item.data.name, 40, 0.6) }</Link>
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
          <Link name="threadRoute" params={ params }>{ item.data.name }</Link>
          to
          <Link name="projectRoute" params={ params }>{ project.name || 'Untitled Project' }</Link>
        </span>
      )
    }
    return (
      <span>
        added a new thread:
        <Link name="threadRoute" params={ params }>{ item.data.name }</Link>
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
          <Link name="threadRoute" params={ params }>{ thread.name }</Link>
          in
          <Link name="projectRoute" params={ params }>{ project.name }</Link>
        </span>
      )
    }
      return (
        <span>
          commented on
          <Link name="threadRoute" params={ params }>{ thread.name }</Link>
        </span>
      )
  },
  commit: (item, type, entity) => {
    const params = {
      projectId: item.data.project._id,
      commitId: item._id
    }
    if (type === 'file') {
      return (
        <span>
          added this file to commit:
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
        </span>
      )
    } else if (type === 'feed') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
          to
          <Link name="projectRoute" params={ params }>{ item.data.project.name || 'Untitled Project' }</Link>
        </span>
      )
    } else if (type === 'project' || type === 'user') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
          containing { pluralise(item.data.items.length, 'revision') }
        </span>
      )
    } else if (type === 'thread') {
      return (
        <span>
          referenced this thread in commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
        </span>
      )
    }
  },
  completed: (item, type, entity) => {
    const params = {
      projectId: item.data.project._id,
      commitId: get(item, 'data.commit._id'),
      threadId: get(item, 'data.thread._id'),
    }
    if (type === 'thread') {
      if (item.data.summary) {
        return <span>
          marked this as complete in commit
          <Link
            className="link-primary"
            closeModals
            name="commitRoute"
            params={ params }
          >
            { item.data.summary }
          </Link>
        </span>
      } else {
        return <span>marked this as complete</span>
      }
    } else {
      return (
        <span>
          marked the thread
          <Link
            className="link-primary"
            closeModals
            name="threadRoute"
            params={ params }
          >
            { get(item, 'data.thread.name') }
          </Link>
          { get(item, 'data.commmit._id') &&
            <span>
              as complete in commit
              <Link
                className="link-primary"
                closeModals
                name="commitRoute"
                params={ params }
              >
                { item.data.commit.summary }
              </Link>
            </span>
          }
        </span>
      )
    }
  },
  changedLabels: (item, type, entity) => {
    if (type === 'thread' || type === 'project') {
      const hasAddedLabels = item.data.addedLabels && item.data.addedLabels.length > 0
      const hasRemovedLabels = item.data.removedLabels && item.data.removedLabels.length > 0
      const params = {
        projectId: entity.data.project,
        threadId: item.thread._id,
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
              <Link name="threadRoute" params={ params }>{ item.thread.name || 'Untitled Thread'}</Link>
            </span>
          }
        </span>
      )
    } else {
      return <span>Changed Labels</span>
    }
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
};
