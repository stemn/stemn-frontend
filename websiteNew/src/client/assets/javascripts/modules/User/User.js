import React, { Component, PropTypes } from 'react'
import classes from './User.css'
import classNames from 'classnames'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import Link from 'stemn-shared/misc/Router/Link'

class User extends Component {
  render() {
    const { user, className } = this.props

    if (user && user.data) {
      const userId = user.data._id
      return (
        <div className={ classNames('layout-row layout-align-start-center', className) } >
          <Link name="userRoute" params={ { userId } }>
            <UserAvatar
              className={ classes.avatar }
              name={ user.data.name }
              picture={ user.data.picture }
              shape='square'
              size={ 50 }
            />
          </Link>
          <div className='layout-column flex'>
            <Link
              className={ classNames('link-primary', classes.title) }
              name="userRoute" params={ { userId } }>
              { user.data.name }
            </Link>
            <div className={ classes.blurb }>{ user.data.blurb }</div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default User
