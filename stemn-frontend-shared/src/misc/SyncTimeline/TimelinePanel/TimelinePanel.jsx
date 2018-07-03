// Component Core
import React from 'react'
import moment from 'moment'

// Styles
import classNames from 'classnames'
import classes from './TimelinePanel.css'

// Sub Components
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'

export default class TimelinePanel extends React.Component {
  render() {
    const { item, children, style } = this.props

    return (
      <div className={ `${classes.item} layout-row` } style={ style }>
        <div className={ classes.avatar }>
          <UserAvatar picture={ item.user.picture } size="33" shape="square" />
        </div>
        <div className={ `${classes.body} flex` }>
          <div className={ classes.content }>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
