import React, { Component } from 'react'
import classes from './UserStars.css'
import Pagination from 'stemn-shared/misc/Pagination'
import ProjectRow from 'stemn-shared/misc/Projects/ProjectRow'

export default class UserStars extends Component {
  render() {
    const { items, user, page, size, location } = this.props
    const noMoreResults = items && items.data && items.data.length < size

    return (
      <div>
        <div className="text-mini-caps">Projects { user.data.profile.firstname } Starred</div>
        <br />
        <div className={ classes.panel }>
          { items && items.data
            ? items.data.map(projectId => (
              <ProjectRow
                size="wide"
                key={ projectId }
                projectId={ projectId }
                className={ classes.project }
              />
            ))
            : null }
        </div>
        <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults } />
      </div>
    )
  }
}
