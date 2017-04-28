import React, { Component, PropTypes } from 'react'
import Link from 'stemn-shared/misc/Router/Link'
import { getMentionInfo } from 'stemn-shared/misc/Mentions/Mentions.utils'

/******************************************************
This component is used to display a mention based on its
display and href.

Eg:
display: 'David Revay'
href: '47db55af7f3423801742e228:user:cb4e8fac7fe980b5da295624' (entityId, mentionType, mentionId )

When using this component on desktop, a container is used
to pass in 'showTaskModal'.

*******************************************************/
export default class MentionFromString extends Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    display: PropTypes.string.isRequired,
    // From the container (only if desktop)
    showTaskModal: PropTypes.func,
  }
  render() {
    const { href, display, showTaskModal } = this.props
    const [ entityId, mentionType, mentionId ] = href.split(':')

    const mentionInfo = getMentionInfo(mentionType, entityId, display)

    if (mentionInfo) {
      // If this is a task and we are desktop
      if (mentionType === 'task' || mentionType === 'task-complete' && GLOBAL_ENV.APP_TYPE === 'desktop') {
        const showTask = () => showTaskModal({
          taskId: entityId
        })
        return (
          <a
            href=""
            onClick={ showTask }
          >
            { mentionInfo.display }
          </a>
        )
      } else {
        return (
          <Link
            name={ mentionInfo.route }
            params={ mentionInfo.params }
          >
            { mentionInfo.display }
          </Link>
        )
      }
    } else {
      return null
    }
  }
}
