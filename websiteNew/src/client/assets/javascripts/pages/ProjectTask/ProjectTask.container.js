import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProjectTask from './ProjectTask';

const stateToProps = ({ projects }, { params, location }) => {
  const projectId   = params.stub;
  const path        = params.path || '';
  const project     = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`;

  return {
    project,
    entityModel,
    path,
  };
}

const dispatchToProps = {
};

@connect(stateToProps, dispatchToProps)
export default class ProjectTaskContainer extends Component {
  render() {
    return (
      <ProjectTask {...this.props} />
    );
  }
}
