import React, { Component, PropTypes } from 'react';
import Link from 'stemn-shared/misc/Router/Link'
import TaskLabelDots from 'stemn-shared/misc/Tasks/TaskLabelDots/TaskLabelDots.jsx'
import pluralise from 'stemn-shared/utils/strings/pluralise'

const eventTextMap = {
  uncompleted: (item, type, entity) => <span>re-opened this task</span>,
  addAsignee: (item, type, entity) => <span>was assigned to this task</span>,
  removeAsignee : (item, type, entity) => <span>was removed from assignees</span>,
  revision: (item, type, entity) => {
    const fileRouteParams = {
      projectId: item.data.project._id,
      fileId: item.data.fileId,
      revisionId: item.data.revisionId,
    }
    if (type === 'file') {
      return (
        <span>
          {  !item.data.revisionNumber || item.data.revisionNumber === 0
          ? 'created this file'
          : `added rev.${item.data.revisionNumber}` }
        </span>
      )
    } else {
      return (
        <span>
          { !item.data.revisionNumber || item.data.revisionNumber === 0
          ? 'created'
          : `added revision ${item.data.revisionNumber} to` }
          <Link name="fileRoute" params={ fileRouteParams }>{ item.data.name }</Link>
        </span>
      )
    }
  },
  task: (item, type, entity) => {
    const params = {
      projectId: item.data.project,
      taskId: item._id
    }
    if (type === 'feed') {
      return (
        <span>
          added a new thread:
          <Link name="taskRoute" params={ params }>{ item.data.name }</Link>
          to
          <Link name="projectRoute" params={ params }>{ item.data.project.name || 'Untitled Project' }</Link>
        </span>
      )
    }
    return (
      <span>
        added a new thread:
        <Link name="taskRoute" params={ params }>{ item.data.name }</Link>
      </span>
    )
  },
  comment: (item, type, entity) => {
    const params = {
      projectId: item.data.project,
      taskId: item._id
    }
    return (
      <span>
        commented on
        <Link name="taskRoute" params={ params }>{ item.data.name }</Link>
        in
        <Link name="projectRoute" params={ params }>{ item.data.project.name || 'Untitled Project' }</Link>
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
    } else if (type === 'task') {
      return (
        <span>
          referenced this thread in commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
        </span>
      )
    }
  },
  completed: (item, type, entity) => {
    if (item.data.summary) {
      const params = {
        projectId: item.data.project._id,
        commitId: item.commit._id
      };
      return <span>
        marked this as complete in commit
        <Link
          className="link-primary"
          closeModals
          name="commitRoute"
          params={ params }
          scope="main"
          show
        >
          &nbsp;{ item.data.summary }
        </Link>
      </span>
    } else {
      return <span>marked this as complete</span>
    }
  },
  changedLabels: (item, type, entity) => {
    console.log(item);
    if (type === 'task' || type === 'project') {
      const hasAddedLabels = item.data.addedLabels && item.data.addedLabels.length > 0
      const hasRemovedLabels = item.data.removedLabels && item.data.removedLabels.length > 0
      const params = {
        projectId: entity.data.project,
        taskId: item.task._id,
      }
      return (
        <span>
          { hasAddedLabels &&
            <span>
              added the&nbsp;
              <TaskLabelDots
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
              <TaskLabelDots
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
              <Link name="taskRoute" params={ params }>{ item.task.name || 'Untitled Thread'}</Link>
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
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    item: PropTypes.object,
    entity: PropTypes.object,
  }
  render() {
    const { item, type, entity } = this.props
    return eventTextMap[item.event]
      ? eventTextMap[item.event](item, type, entity)
      : <span>Unknown Event Type: { item.event }</span>
  }
};
