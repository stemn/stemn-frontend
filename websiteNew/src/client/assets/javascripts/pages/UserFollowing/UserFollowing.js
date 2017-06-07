import React, { Component, PropTypes } from 'react'
import classes from './UserFollowing.css'
import classNames from 'classnames'
import Pagination from 'stemn-shared/misc/Pagination'
import UserRow from 'stemn-shared/misc/Users/UserRow'

export default class UserFollowing extends Component {
  render() {
    const { user, items, page, size, location } = this.props
    const noMoreResults = items && items.data && items.data.length < size

    return (
      <div>
        <div className='text-mini-caps'>People who follow { user.data.profile.firstname }</div>
        <br/>
        <div className={ classes.panel }>
          { items && items.data
          ? items.data.map((userId) => (
            <UserRow
              key={ userId }
              userId={ userId }
              className={ classes.user }
            />
          ))
          : null }
        </div>
        <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults }/>
      </div>
    )
  }
}
