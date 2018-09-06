import React, { Component } from 'react'

import classes from './UserMinimalRow.scss'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'

export default class UserMinimalRow extends Component {
  render() {
    const { user, children, noLink } = this.props
    const inner = (
      <div className="layout-row layout-align-start-center">
        <UserAvatar
          className={ classes.avatar }
          name={ user.name }
          picture={ user.picture }
          size={ 30 }
          shape="square"
        />
        <div className="flex">{ user.name }</div>
        <div>{ children }</div>
      </div>
    )
    if (noLink) {
      return (
        <div className={ classes.user }>
          { inner }
        </div>
      )
    } 
    return (
      <Link
        key={ user._id }
        name="userRoute"
        params={ { userId: user._id } }
        className={ classes.user }
      >
        { inner }
      </Link>
    )
  }
}
