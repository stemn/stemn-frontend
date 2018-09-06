import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import StandardLayout from 'layout/StandardLayout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import { get, has } from 'lodash'
import Link from 'stemn-shared/misc/Router/Link'
import SubHeader from 'modules/SubHeader'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner'
import { ProjectInfoIcons } from 'stemn-shared/misc/Projects/ProjectInfoIcons'

class Project extends Component {
  render() {
    const { children, project } = this.props
    const routeParams = { projectId: get(project, 'data._id') }
    
    const title = [
      <div key="text">
        { project && project.data && <Link name="projectRoute" params={ routeParams }>{project.data.name}</Link> }
      </div>,
      <ProjectInfoIcons key="icons" project={ project && project.data } padLeft />
    ]

    return (
      <StandardLayout style={ { marginTop: '30px' } } nofooter>
        <Helmet>
          { has(project, 'data.name') && <title>{ `${project.data.name}: ${project.data.blurb}` }</title> }
        </Helmet>
        <SubHeader
          title={ title }
          noline
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
              activeIf={ { includes: ['projectThreadsRoute'] } }
              name="projectThreadsRoute" params={ routeParams }
            >
              Threads
            </Link>
            <Link
              activeIf={ { includes: ['projectCommitsRoute'] } }
              name="projectCommitsRoute"
              params={ routeParams }
            >
              History
            </Link>
            <Link
              activeIf={ { includes: ['projectPipelinesRoute'] } }
              name="projectPipelinesRoute"
              params={ routeParams }
            >
              Pipelines
            </Link>
            <Link
              activeIf={ { includes: ['projectTeamRoute'] } }
              name="projectTeamRoute"
              params={ routeParams }
            >
              Team
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
          { children }
        </div>
      </StandardLayout>
    )
  }
}

export default Project
