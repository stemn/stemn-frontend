import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';

import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js';

import UserProjects from './UserProjects';

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  projects: state.projects.userProjects
});

const dispatchToProps = {};

const fetchConfigs = [];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserProjectsContainer extends Component {
  render() {
    return (
      <UserProjects {...this.props} />
    );
  }
}
