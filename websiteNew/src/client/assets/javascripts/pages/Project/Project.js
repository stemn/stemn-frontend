import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import classes from './Project.css'
import { Helmet } from "react-helmet";
import StandardLayout from 'layout/StandardLayout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import { Container } from 'stemn-shared/misc/Layout'
import { get, has } from 'lodash'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import SubHeader from 'modules/SubHeader'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner'
import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'

class Project extends Component {

  render() {
    const { children, project, pathname, currentUser } = this.props
    const routeParams = { projectId: get(project, 'data._id') }
    const publicIcon = (
      <PublicPrivateIcon
        type={ get(project, 'data.permissions.projectType', 'public') }
        style={ { marginRight: '8px' } }
        size={ 30 }
      />
    )

    return (
      <StandardLayout style={ { marginTop: '30px' } } nofooter>
        <Helmet>
          { has(project, 'data.name') && <title>{ `${project.data.name}: ${project.data.blurb}` }</title> }
        </Helmet>
        <SubHeader
          title={ get(project, 'data.name', ' ') || 'Untitled Project' }
          noline
          icon={ publicIcon }
        >
          <Tabs noline>
            <Link
              activeIf={ { is: ['projectRoute'], includes: ['projectFilesRoute'] } }
              name="projectRoute"
              params={ routeParams }
            >
              Overview
            </Link>
            <Link
              activeIf={ { includes: ['projectTeamRoute'] } }
              name="projectTeamRoute"
              params={ routeParams }
            >
              Team
            </Link>
            <Link
              activeIf={ { includes: ['projectCommitsRoute'] } }
              name="projectCommitsRoute"
              params={ routeParams }
            >
              History
            </Link>
            <Link
              activeIf={ { includes: ['projectTasksRoute'] } }
              name="projectTasksRoute" params={ routeParams }
            >
              Threads
            </Link>
            <IsOwner
              team={ get(project, 'data.team', []) }
              minRole="admin"
            >
              <Link
                activeIf={ { includes: ['projectSettingsRoute'] } }
                name="projectSettingsRoute"
                params={ routeParams }
              >
                Settings
              </Link>
            </IsOwner>
          </Tabs>
        </SubHeader>
        <div className="flex layout-column">
          { project && project.data && project.dataSize === 'lg'
            ? children
            : null
          }
        </div>
      </StandardLayout>
    )
  }
}

export default Project
