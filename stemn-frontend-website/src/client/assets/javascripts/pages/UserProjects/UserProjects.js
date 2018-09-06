import React, { Component } from 'react'
import { orderBy } from 'lodash'
import classes from './UserProjects.css'
import { ProjectRowContainer } from 'stemn-shared/misc/Projects/ProjectRow'

export default class UserProjects extends Component {
  render() {
    const { projects } = this.props
    return (
      <div>
        <div className="text-mini-caps">Projects</div>
        <br />
        { orderBy(projects.data, 'updated', 'desc').map(project => (
          <ProjectRowContainer
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
