import React, { Component } from 'react'
import classes from './MentionPopover.css'
import Popover from 'stemn-shared/misc/Popover'
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import cn from 'classnames'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'

export default class MentionPopover extends Component {
  render() {
    const { caretPosition, showPopover, query, results, addMention } = this.props

    const caretPositionStyles = {
      left: caretPosition.left,
      top: caretPosition.top,
    }

    const hasResult = results && results.data && results.data.length > 0

    return (
      <Popover
        open={ showPopover && hasResult }
        preferPlace="below"
        tipSize={ 1 }
        offset={ 10 }
      >
        <div className={ classes.caret } style={ caretPositionStyles } />
        <div className={ cn('PopoverMenu', classes.popover) }>
          <LoadingOverlay show={ !results || results.loading } linear noOverlay />
          { hasResult && results.data.map(result => (
            <a
              key={ result._id }
              onClick={ () => addMention(result) }
              className="layout-row layout-align-start-center"
            >
              <UserAvatar
                picture={ result.picture }
                name={ result.name }
                size={ 25 }
                shape="square"
                style={ { marginRight: '10px' } }
              />
              <Highlight
                text={ result.name }
                query={ query }
                hightlightClass={ classes.highlight }
              />
            </a>
          ))}
        </div>
      </Popover>
    )
  }
}
