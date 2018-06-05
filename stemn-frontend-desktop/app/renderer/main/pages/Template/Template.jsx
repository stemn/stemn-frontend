// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js'

// Component Core
import React from 'react'

// Styles
import classNames from 'classnames'

// Sub Components


// /////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    return (
      <div />
    )
  },
})


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ projects, projectSettings }, { params }) {
  return {
    project: projects[params.stub],
    projectSettings,
    entityModel: `projects.${params.stub}`,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
