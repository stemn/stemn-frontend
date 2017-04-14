import React, { Component, PropTypes } from 'react';

import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'
import classes from './MyProjectsPanel.scss'
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
  componentWillMount() {
    this.props.getUserProjects({
      userId: this.props.user._id
    })
  }
  render() {
    const { projects } = this.props
    const orderedByTime = orderBy(projects.data, 'updated', 'desc')
    const limitedProjects = orderedByTime.slice(0, 6)

    return (
      <InfoPanel className={ classes.panel }>
        <h3>My Projects</h3>
        { limitedProjects.map((project) => (
          <Link
            key={ project._id }
            name="projectRoute"
            params={ { projectId: project._id } }
            className={ classes.row + ' layout-row layout-align-start-center'}
          >
            <PublicPrivateIcon className={ classes.publicIcon } type="public" size={ 20 } />
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
