import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { getCommitHistory } from 'stemn-shared/misc/Users/Users.actions'
import UserOverview from './UserOverview';

const stateToProps = ({ users, projects, syncTimeline }, { params }) => ({
  user: users[params.stub],
  projects: projects.userProjects[params.stub] || {},
  timeline: get(syncTimeline, [params.stub, 'data'], []),
});

const dispatchToProps = {
  getCommitHistory
};

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getCommitHistory({ userId: props.params.stub })
  }
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserOverviewContainer extends Component {
  render() {
    return (
      <UserOverview {...this.props} />
    );
  }
}
