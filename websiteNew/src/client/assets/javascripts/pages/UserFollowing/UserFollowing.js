import React, { Component, PropTypes } from 'react'
import classes from './UserFollowing.css'
import classNames from 'classnames'
import User from 'modules/User'
import Pagination from 'stemn-shared/misc/Pagination'

export default class UserFollowing extends Component {

  render() {
    const { user, following, page, size, location } = this.props
    const noMoreResults = following && following.data && following.data.length < size

    return (
      <div>
        <div className='text-mini-caps'>People who follow { user.data.profile.firstname }</div>
        <br/>
        <div className={ classes.panel }>
          { following && following.data
          ? following.data.map((userId) => (
            <User key={ userId } userId={ userId } className={ classes.user } />
          ))
          : null }
        </div>
        <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults }/>
      </div>
    )
  }
}
