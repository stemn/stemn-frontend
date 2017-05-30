// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Threads          from 'stemn-shared/misc/Threads/Threads.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { project, entityModel } = this.props;
    return (
      <Threads projectId={project.data._id} />
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({threads, projects}, {params}) {
  const project = projects.data[params.stub];
  return {
    project: project,
    entityModel: `projects.data.${params.stub}`
  };
}


function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
