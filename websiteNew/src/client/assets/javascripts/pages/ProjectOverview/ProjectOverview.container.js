import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { push as pushRoute } from 'react-router-redux'
import { saveProject } from 'stemn-shared/misc/Projects/Projects.actions'
import ProjectOverview from './ProjectOverview';
import { getCanEdit } from 'stemn-shared/misc/Auth/Auth.utils'
import { get } from 'lodash'

const stateToProps = ({ projects, projectSettings, fileList, auth }, { params, location, provider }) => {
  const projectId = params.stub;
  const path = params.path || '';
  const project = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`;
  const fileListCacheKey = `${projectId}-${path}-${provider}`
  const files = fileList[fileListCacheKey]
  const canEdit = getCanEdit(auth.user, get(project, 'data.owner'), get(project, 'data.team'), 'admin')

  return {
    project,
    entityModel,
    path,
    files,
    isFilePage: location.pathname.includes('/files/'),
    canEdit,
  };
}

const dispatchToProps = {
  pushRoute,
  saveProject,
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <ProjectOverview {...this.props} />
    );
  }
}
