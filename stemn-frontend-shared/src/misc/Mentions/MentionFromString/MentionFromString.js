import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'stemn-shared/misc/Router/Link'
import { getMentionInfo } from 'stemn-shared/misc/Mentions/Mentions.utils'

/** ****************************************************
This component is used to display a mention based on its
display and href.

Eg:
display: 'David Revay'
href: '47db55af7f3423801742e228:user:cb4e8fac7fe980b5da295624' (entityId, mentionType, mentionId )

When using this component on desktop, a container is used
to pass in 'showThreadModal'.

****************************************************** */
export default class MentionFromString extends Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    display: PropTypes.string.isRequired,
    // From the container (only if desktop)
    showThreadModal: PropTypes.func,
  }
  render() {
    const {
      href,
      display,
    } = this.props
    const [entityId, mentionType, mentionId] = href.split(':')

    const mentionInfo = getMentionInfo(mentionType, entityId, display)

    if (mentionInfo) {
      return (
        <Link
          name={ mentionInfo.route }
          params={ mentionInfo.params }
        >
          { mentionInfo.display }
        </Link>
      )
    } 
    return null
  }
}
