import React, { Component, PropTypes } from 'react'
import { orderBy } from 'lodash'
import classes from './UserProjects.css'
import classNames from 'classnames'
import ProjectRow from 'stemn-shared/misc/Projects/ProjectRow'

export default class UserProjects extends Component {
  render() {
    const { projects } = this.props
    return (
      <div>
        { orderBy(projects.data, 'updated', 'desc').map((project) => (
          <ProjectRow
            size="wide"
            key={ project._id }
            projectId={ project._id }
            className={ classes.project }
          />
        ))}
      </div>
    )
  }
}
