import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProjectSettingsGeneral from './ProjectSettingsGeneral';
import { saveProject } from 'stemn-shared/misc/Projects/Projects.actions';

const stateToProps = ({ projects }, { params }) => {
  const projectId   = params.stub;
  const project     = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`;

  return {
    project,
    entityModel,
  };
};

const dispatchToProps = {
  saveProject
};

@connect(stateToProps, dispatchToProps)
export default class ProjectSettingsGeneralContainer extends Component {
  render() {
    return (
      <ProjectSettingsGeneral {...this.props} />
    );
  }
}
