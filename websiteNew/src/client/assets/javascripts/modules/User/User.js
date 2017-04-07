import React, { Component, PropTypes } from 'react'
import classes from './User.css'
import classNames from 'classnames'

import { userRoute } from 'route-actions'
import moment from 'moment'

import { Link } from 'react-router'

class User extends Component {
  render() {
    const { user, className } = this.props

    if (user && user.data) {
      const userId = user.data._id
      return (
        <div className={ classNames(classes.user, 'layout-row', className) } >
          <div className='layout-column flex'>
            <Link className={ classNames('link-primary', classes.title) } to={ userRoute({ userId }) }>{ user.data.name }</Link>
          </div>
          { user.data.picture
          ? <Link to={ userRoute({ userId }) }>
              <img
                className={ classes.picture }
                src={`${GLOBAL_ENV.API_SERVER}${user.data.picture}?size=feed-sm&crop=true`}
              />
            </Link>
          : null }

        </div>
      )
    } else {
      return null;
    }
  }
}

export default User
