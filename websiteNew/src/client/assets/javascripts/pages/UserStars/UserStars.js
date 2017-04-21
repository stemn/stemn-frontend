import React, { Component, PropTypes } from 'react'
import { orderBy } from 'lodash'
import classes from './UserStars.css'
import classNames from 'classnames'
import ProjectRow from 'stemn-shared/misc/Projects/ProjectRow'

export default class UserStars extends Component {
  render () {
    const { projects } = this.props
    return (
      <div>
        { projects && projects.data
          ? projects.data.map((projectId) => (
            <ProjectRow
              size="wide"
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
