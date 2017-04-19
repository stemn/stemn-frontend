import React, { Component, PropTypes } from 'react'

import classNames from 'classnames'
import classes from './Project.css'

import StandardLayout from 'layout/StandardLayout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import { Container } from 'stemn-shared/misc/Layout'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import SubHeader from 'modules/SubHeader'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner'


class Project extends Component {
  renderComplete () {
    const { children, project, pathname, currentUser } = this.props
    const routeParams = { projectId: project.data._id }

    return (
      <div className='layout-column flex'>
        <SubHeader title={ project.data.name } noline>
          <Tabs noline style={ { height: '100%' } }>
            <Link activeIf={ { is: ['projectRoute'], includes: ['projectFilesRoute'] } }
              name="projectRoute" params={ routeParams }>
              Overview
            </Link>
            <Link
              activeIf={ { includes: ['projectTeamRoute'] } }
              name="projectTeamRoute" params={ routeParams }>
              Team
            </Link>
            <Link
              activeIf={ { includes: ['projectCommitsRoute'] } }
              name="projectCommitsRoute" params={ routeParams }>
              15 Commits
            </Link>
            <Link
              activeIf={ { includes: ['projectTasksRoute'] } }
              name="projectTasksRoute" params={ routeParams }>
              6 Tasks
            </Link>
            <IsOwner team={ project.data.team } minRole="admin">
              <Link
                activeIf={ { includes: ['projectSettingsRoute'] } }
                name="projectSettingsRoute" params={ routeParams }>
                Settings
              </Link>
            </IsOwner>
          </Tabs>
        </SubHeader>
        <div className={ "flex layout-column" }>
          { children }
        </div>
      </div>
    )
  }
  renderPending() {
    return (
      <div>Loading</div>
    )
  }

  render() {
    const { project } = this.props
    return (
      <StandardLayout style={ { marginTop: '30px' } } nofooter>
        { project && project.data
          ? this.renderComplete()
          : null
        }
      </StandardLayout>
    )
  }
}

export default Project


//        <div className={ classes.header }>
//          <Container className={classNames(classes.headerInner, 'layout-row layout-align-start-center')}>
//            <Link name='userRoute' params={ { userId: project.data.team[0]._id } }>
//              <UserAvatar
//                name={ project.data.team[0].name }
//                picture={ project.data.team[0].picture }
//                size={ 30 }
//                shape='square'
//              />
//            </Link>
//            <h1 className={ classes.title }>
//              { project.data.name }
//            </h1>
//            <div className='flex'></div>

//          </Container>
//        </div>
