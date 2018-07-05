import { connect } from 'react-redux'
import { get } from 'lodash'

// Component Core
import React from 'react'

import classes from './ProjectSettingsPage.css'

import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'

export class Component extends React.Component {
  render() {
    const {
      project,
    } = this.props
    const baseLink = project && project.data && project.data._id ? `project/${project.data._id}` : ''

    return (
      <div className={ `${classes.container} layout-row flex scroll-box` }>
        <div style={ { width: '250px', marginRight: '15px' } }>
          <div className={ classes.panel } style={ { padding: '0px' } }>
            <NavPill className="primary" name="webProjectRoute" params={ { projectId: get(project, 'data._id') } }>View project on stemn.com</NavPill>
          </div>
          <div className={ classes.panel } style={ { padding: '0px' } }>
            <NavPill to={ `${baseLink}/settings` } onlyActiveOnIndex>General</NavPill>
            <NavPill to={ `${baseLink}/settings/permissions` }>Permissions</NavPill>
            <NavPill to={ `${baseLink}/settings/threads` }>Threads</NavPill>
            <NavPill to={ `${baseLink}/settings/team` }>Team</NavPill>
          </div>
        </div>
        <div style={ { width: '650px' } }>
          {this.props.children}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ projects }, otherProps) {
  return {
    project: projects.data[otherProps.params.stub],
    entityModel: `projects.data.${otherProps.params.stub}`,
  }
}


export default connect(mapStateToProps)(Component)
