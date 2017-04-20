import React, { Component, PropTypes } from 'react'

import SubHeader from 'modules/SubHeader'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'
import pluralise from 'stemn-shared/utils/strings/pluralise'

export default class UserNavHeader extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  render() {
    const { user, currentUser } = this.props

    const isCurrentUser = user.data._id === currentUser._id;
    const routeParams = { userId: user.data._id }

    return (
      <SubHeader title={ user.data.name } style={ { marginBottom: '30px' } }>
        <Tabs noline>
          <Link activeClassName="active" params={ routeParams } name="userRoute" onlyActiveOnIndex>Overview</Link>
          <Link activeClassName="active" params={ routeParams } name="userDetailsRoute">Details</Link>
          <Link activeClassName="active" params={ routeParams } name="userProjectsRoute">{ pluralise(user.data.numProjects, 'Project') }</Link>
          <Link activeClassName="active" params={ routeParams } name="userStarsRoute">{ pluralise(user.data.likes, 'Star') }</Link>
          <Link activeClassName="active" params={ routeParams } name="userFollowersRoute">{ pluralise(user.data.numFollowers, 'Follower') }</Link>
          <Link activeClassName="active" params={ routeParams } name="userFollowingRoute">{ user.data.numFollowing } Following</Link>
          { isCurrentUser
          ? <Link activeClassName='active' name="settingsRoute">Settings</Link>
          : null }
        </Tabs>
      </SubHeader>
    )
  }
}
