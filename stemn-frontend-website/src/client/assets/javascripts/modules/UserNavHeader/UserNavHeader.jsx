import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SubHeader from 'modules/SubHeader'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'
import pluralise from 'stemn-shared/utils/strings/pluralise'

export default class UserNavHeader extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const { user, currentUser } = this.props

    const isCurrentUser = user.data._id === currentUser._id
    const routeParams = { userId: user.data._id }
    
    const hasExperience = user.data.profile.profileDetails.experience && user.data.profile.profileDetails.experience.length > 0
    const hasEducation = user.data.profile.profileDetails.education && user.data.profile.profileDetails.education.length > 0
    const hasAbout = user.data.profile.profileDetails.summary.length > 0
    const hasNoDetails = !hasExperience && !hasEducation && !hasAbout

    return (
      <SubHeader title={ `${user.data.profile.firstname} ${user.data.profile.lastname}` } style={ { marginBottom: '30px' } }>
        <Tabs noline>
          <Link activeClassName="active" params={ routeParams } name="userRoute" onlyActiveOnIndex>Overview</Link>
          { !hasNoDetails && <Link activeClassName="active" params={ routeParams } name="userDetailsRoute">Details</Link> }
          <Link activeClassName="active" params={ routeParams } name="userProjectsRoute">{ pluralise(user.data.numProjects, 'Project') }</Link>
          <Link activeClassName="active" params={ routeParams } name="userStarsRoute">{ pluralise(user.data.numLikes, 'Star') }</Link>
          <Link activeClassName="active" params={ routeParams } name="userFollowersRoute">{ pluralise(user.data.numFollowers, 'Follower') }</Link>
          <Link activeClassName="active" params={ routeParams } name="userFollowingRoute">{ user.data.numFollowing } Following</Link>
          { isCurrentUser
            ? <Link activeClassName="active" name="settingsRoute">Settings</Link>
            : null }
        </Tabs>
      </SubHeader>
    )
  }
}
