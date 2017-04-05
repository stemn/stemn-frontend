import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';

import UserStars from './UserStars';

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  projects: state.projects.userProjects
});

const dispatchToProps = {};

const fetchConfigs = [];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserStarsContainer extends Component {
  render() {
    return (
      <UserStars {...this.props} />
    );
  }
}
