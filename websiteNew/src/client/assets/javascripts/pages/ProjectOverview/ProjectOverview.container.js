import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { push as pushRoute } from 'react-router-redux';

import ProjectOverview from './ProjectOverview';

const stateToProps = ({ projects, projectSettings, fileList }, { params, location }) => {
  const projectId   = params.stub;
  const path        = params.path || '';
  const project     = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`;
  const files       = fileList[`${projectId}-${path}`];

  return {
    project,
    entityModel,
    path,
    files,
    isFilePage: location.pathname.includes('/files/')
  };
}

const dispatchToProps = {
  pushRoute
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <ProjectOverview {...this.props} />
    );
  }
}