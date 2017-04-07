import React, { Component, PropTypes } from 'react'

import SubHeader from 'modules/SubHeader'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import { Link } from 'react-router'

export default class UserNavHeader extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  render() {
    const { user, currentUser } = this.props

    const isCurrentUser = user.data._id === currentUser._id;
    const baseUrl = `/users/${user.data._id}`

    return (
      <SubHeader title={ user.data.name }>
        <Tabs noline style={ { height: '100%' } }>
          <Link activeClassName='active' to={`${baseUrl}`} onlyActiveOnIndex>Overview</Link>
          <Link activeClassName='active' to={`${baseUrl}/details`}>Details</Link>
          <Link activeClassName='active' to={`${baseUrl}/projects`}>Projects</Link>
          <Link activeClassName='active' to={`${baseUrl}/stars`}>Stars</Link>
          <Link activeClassName='active' to={`${baseUrl}/followers`}>Followers</Link>
          <Link activeClassName='active' to={`${baseUrl}/following`}>Following</Link>
          { isCurrentUser
          ? <Link activeClassName='active' to={`/settings`}>Settings</Link>
          : null }
        </Tabs>
      </SubHeader>
    )
  }
}
