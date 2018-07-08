import { connect } from 'react-redux'

// Container Actions

// Component Core
import React from 'react'

import ThreadsDisplay from 'stemn-shared/misc/Threads/ThreadsDisplay'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  render() {
    const {
      project,
    } = this.props
    return (
      <ThreadsDisplay projectId={ project.data._id } />
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ threads, projects }, { params }) {
  const project = projects.data[params.stub]
  return {
    project,
    entityModel: `projects.data.${params.stub}`,
  }
}


function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
