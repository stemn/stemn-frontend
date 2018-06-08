import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import StandardLayout from 'layout/StandardLayout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import { get, has } from 'lodash'
import Link from 'stemn-shared/misc/Router/Link'
import SubHeader from 'modules/SubHeader'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner'
import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'
import ProviderIcon from 'stemn-shared/misc/Icons/ProviderIcon'
import MdContentCopy from 'react-icons/md/content-copy'

class Project extends Component {
  render() {
    const { children, project } = this.props
    const routeParams = { projectId: get(project, 'data._id') }
    const isClone = get(project, 'data.clone.source')
    
    const title = [
      <div key="text">
        { project && project.data && <Link name="projectRoute" params={ routeParams }>{project.data.name}</Link> }
      </div>,
      <div
        key="public-icon"
        title={ get(project, 'data.private') ? 'Private Project' : 'Public Project' }
      >
        <PublicPrivateIcon
          private={ get(project, 'data.private') }
          style={ { marginLeft: '10px' } }
          noColor
        />
      </div>,
      ...(isClone 
        ? [<Link
          name="projectRoute"
          params={ { projectId: project.data.clone.source } }
          key="clone-icon"
          title="Cloned Project. View Original."
        >
          <MdContentCopy
            style={ { marginLeft: '10px' } }
          />
        </Link>] 
        : []),
      <div           
        key="provider-icon"
        title={ `Files stored in ${get(project, 'data.remote.provider')}` }
      >
        <ProviderIcon 
          style={ { marginLeft: '10px' } }
          provider={ get(project, 'data.remote.provider') }
        />
      </div>,
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
