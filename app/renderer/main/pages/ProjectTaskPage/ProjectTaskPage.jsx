// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

import u from 'updeep';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import TaskList       from 'app/renderer/main/modules/Tasks/TaskList/TaskList.jsx'
import Tasks       from 'app/renderer/main/modules/Tasks/Tasks.jsx'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  render() {
    const { project, entityModel } = this.props;
    return (
      <Tasks projectId={project.data._id} />
    )
  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks, projects}, {params}) {
  const project = projects[params.stub];
  return {
    project: project,
    entityModel: `projects.${params.stub}`
  };
}


function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
