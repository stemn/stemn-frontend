import React, { Component, PropTypes } from 'react'

import classes from './UserFollowing.css'
import classNames from 'classnames'

import User from 'modules/User'

export default class UserFollowing extends Component {

  render() {
    const { following } = this.props
    return (
      <div className={ classes.panel }>
        { following && following.data
          ? following.data.map((userId) => (
            <User key={ userId } userId={ userId } className={ classes.user } />
          ))
          : <div>No following found</div>
        }
      </div>
    )
  }
}
