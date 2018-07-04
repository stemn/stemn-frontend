import React, { Component } from 'react'

import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'
import classes from './MyProjectsPanel.scss'
import cn from 'classnames'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import Link from 'stemn-shared/misc/Router/Link'
import { orderBy } from 'lodash'
import bookVector from 'stemn-shared/assets/images/pure-vectors/book.svg'
import { get } from 'lodash'
import ProviderIcon from 'stemn-shared/misc/Icons/ProviderIcon'

export default class MyProjectsPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
    }
  }
  componentWillMount() {
    this.props.getUserProjects({
      userId: this.props.user._id,
    })
  }
  more = () => {
    this.setState({
      page: this.state.page + 1,
    })
  }
  render() {
    const { projects, newProject } = this.props
    const { page } = this.state
    const size = 6
    const orderedByTime = orderBy(projects.data, 'updated', 'desc')
    const limitedProjects = orderedByTime.slice(0, page * 6)
    const notEnoughResult = page * size >= orderedByTime.length
    const isLoading = get(projects, 'data.loading')
    const hasNoResults = limitedProjects.length === 0

    return (
      <InfoPanel className={ cn(classes.panel, 'layout-column') }>
        { !hasNoResults &&
          <h3 className="layout-row">
            <div className="flex">My Projects</div>
            <a
              className="link-primary"
              disabled={ notEnoughResult }
              onClick={ this.more }
            >
              More
            </a>
          </h3>
        }
        { !hasNoResults && limitedProjects.map(project => (
          <Link
            key={ project._id }
            name="projectRoute"
            params={ { projectId: project._id } }
            className={ `${classes.row} layout-row layout-align-start-center` }
          >
            <PublicPrivateIcon className={ classes.publicIcon } private={ project.private } size={ 20 } />
            <div className="text-ellipsis flex">
              { project.name || 'Untitled Project' }
            </div>
            <ProviderIcon provider={ project.remote.provider } className={ classes.providerIcon } />
          </Link>
        ))}
        { hasNoResults && !isLoading &&
          <div className="flex layout-column layout-align-center-center">
            <img src={ bookVector } style={ { width: '60px' } } />
            <div className="text-title-5" style={ { marginTop: '20px' } }>No Projects. <a className="link-primary" onClick={ newProject }>Create one.</a></div>
          </div>
        }
      </InfoPanel>
    )
  }
}
