import React, { Component, PropTypes } from 'react';
import Link from 'stemn-shared/misc/Router/Link'

const eventTextMap = {
  revision: (item, type) => {
    return <span>modified this file.</span>
  },
  commit: (item, type) => {
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
    } else if ( type === 'feed') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
          to
          <Link name="projectRoute" params={ params }>{ item.data.project._id }</Link>
        </span>
      )
    }
  },
}

export default class TimelineItemText extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    item: PropTypes.object,
  }
  render() {
    const { item, type } = this.props
    return eventTextMap[item.event]
      ? eventTextMap[item.event](item, type)
      : <span>Unknown Event Type</span>
  }
};
