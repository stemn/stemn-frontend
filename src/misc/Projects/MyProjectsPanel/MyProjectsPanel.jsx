import React, { Component, PropTypes } from 'react';

import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'
import classes from './MyProjectsPanel.scss'
import classNames from 'classnames'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import Link from 'stemn-shared/misc/Router/Link'
import Drive from 'stemn-shared/assets/icons/providers/drive.js';
import Dropbox from 'stemn-shared/assets/icons/providers/dropbox.js';
import { orderBy } from 'lodash'

const getIcon = (provider) => {
  if (provider === 'drive') {
    return <Drive className={ classes.providerIcon } />
  } else if (provider === 'dropbox') {
    return <Dropbox className={ classes.providerIcon } />
  } else {
    return <div className={ classes.providerIcon } />
  }
}

export default class MyProjectsPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1
    }
  }
  componentWillMount() {
    this.props.getUserProjects({
      userId: this.props.user._id
    })
  }
  more = () => {
    this.setState({
      page: this.state.page + 1
    })
  }
  render() {
    const { projects } = this.props
    const { page } = this.state
    const size = 6
    const orderedByTime = orderBy(projects.data, 'updated', 'desc')
    const limitedProjects = orderedByTime.slice(0, page * 6)
    const notEnoughResult = page * size >= orderedByTime.length

    return (
      <InfoPanel className={ classes.panel }>
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
        { limitedProjects.map((project) => (
          <Link
            key={ project._id }
            name="projectRoute"
            params={ { projectId: project._id } }
            className={ classes.row + ' layout-row layout-align-start-center'}
          >
            <PublicPrivateIcon className={ classes.publicIcon } type={ project.permissions && project.permissions.projectType } size={ 20 } />
            <div className="text-ellipsis flex">
              { project.name }
            </div>
            { getIcon(project.remote.provider) }
          </Link>
        ))}
      </InfoPanel>
    )
  }
}
