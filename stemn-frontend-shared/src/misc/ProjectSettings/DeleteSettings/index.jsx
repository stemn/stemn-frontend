import React, { Component } from 'react'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class DeleteSettings extends Component {
  render() {
    const { deleteProject } = this.props
    return (
      <div>
        <h3>Delete Project</h3>
        <p>Once you delete a project, there is no going back. Please be certain.</p>
        <div className="layout-row layout-align-end">
          <ProgressButton className="warn" onClick={deleteProject}>
            Delete Project
          </ProgressButton>
        </div>
      </div>
    )
  }
}
