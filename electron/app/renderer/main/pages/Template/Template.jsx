// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components



///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    return (
      <div></div>
    );
  }
});



///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({projects, projectSettings}, {params}) {
  return {
    project: projects[params.stub],
    projectSettings: projectSettings,
    entityModel: `projects.${params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
