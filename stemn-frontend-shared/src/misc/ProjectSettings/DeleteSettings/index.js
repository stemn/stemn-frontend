import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class GeneralSettings extends Component {
  static propTypes = {
    deleteProject: PropTypes.func.isRequired,
  }
  render() {
    const { deleteProject } = this.props
    return (
      <div>
        <h3>Delete Project</h3>
        <p>Once you delete a project, there is no going back. Please be certain.</p>
        <div className="layout-row layout-align-end">
          <ProgressButton 
            className="warn"
            onClick={ deleteProject }
          >
            Delete Project
          </ProgressButton>
        </div>
      </div>
    )
  }
}
