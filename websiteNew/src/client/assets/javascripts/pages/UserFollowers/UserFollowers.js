import React, { Component, PropTypes } from 'react'

import classes from './UserFollowers.css'
import classNames from 'classnames'

import User from 'modules/User'

export default class UserFollowers extends Component {

  render() {
    const { user, followers } = this.props
    return (
      <div className={ classes.panel }>
        { followers && followers.data
          ? followers.data.map((userId) => (
            <User key={ userId } userId={ userId } className={ classes.user } />
          ))
          : <div>No followers found</div>
        }
      </div>
    )
  }
}