import React, { Component, PropTypes } from 'react'

import { orderBy } from 'lodash'

import classes from './UserStars.css'
import classNames from 'classnames'

import Project from 'modules/Project'

export default class UserStars extends Component {
  render () {
    const { projects } = this.props
    return (
      <div className={ classes.panel }>
        { projects && projects.data
          ? projects.data.map((projectId) => (
            <Project
              size='wide'
              key={ projectId }
              projectId={ projectId }
              className={ classes.project }
            />
          ))
          : <div>No stars found</div>
        }
      </div>
    )
  }
}
