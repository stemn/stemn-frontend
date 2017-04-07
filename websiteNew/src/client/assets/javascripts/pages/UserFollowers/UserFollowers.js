import React, { Component, PropTypes } from 'react'

import classes from './UserFollowers.css'
import classNames from 'classnames'

import User from 'modules/User'
import Pagination from 'stemn-shared/misc/Pagination'

export default class UserFollowers extends Component {

  render() {
    const { user, followers, page, size, location } = this.props
    const noMoreResults = followers && followers.data && followers.data.length < size

    return (
      <div>
        <div className='text-mini-caps'>People who follow { user.data.profile.firstname }</div>
        <br/>
        <div className={ classes.panel }>
          { followers && followers.data
          ? followers.data.map((userId) => (
            <User key={ userId } userId={ userId } className={ classes.user } />
          ))
          : null }
        </div>
        <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults }/>
      </div>
    )
  }
}
