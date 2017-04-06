import React, { Component, PropTypes } from 'react'

import classes from './UserFollowing.css'
import classNames from 'classnames'

import User from 'modules/User'

export default class UserFollowing extends Component {

  render() {
    const { following, user } = this.props
    return (
      <div>
        <div className='text-mini-caps'>People { user.data.profile.firstname } follows</div>
        <br/>
        <div className={ classes.panel }>
          { following && following.data
          ? following.data.map((userId) => (
            <User key={ userId } userId={ userId } className={ classes.user } />
          ))
          : null }
        </div>
      </div>
    )
  }
}
