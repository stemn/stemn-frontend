import React, { Component, PropTypes } from 'react'

import { orderBy } from 'lodash'

import classes from './UserProjects.css'
import classNames from 'classnames'

import Project from 'modules/Project'

export default class UserProjects extends Component {
  render() {
    const { projects } = this.props
    console.log('user projec', this.props)
    return (
      <div>
        { orderBy(projects.data, 'updated', 'desc').map((projectId) => (
          <Project
            size='wide'
            key={ projectId }
            projectId={ projectId }
            className={ classes.project }
          />
        ))}
      </div>
    )
  }
}
