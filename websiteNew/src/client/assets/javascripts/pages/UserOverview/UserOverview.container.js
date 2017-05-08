import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { getHistory } from 'stemn-shared/misc/History/History.actions'
import UserOverview from './UserOverview';

const stateToProps = ({ users, projects, history, syncTimeline }, { params }) => {
  const historyCacheKey = `users-${params.stub}`
  return {
    historyCacheKey,
    history: history[historyCacheKey],
    user: users[params.stub],
    projects: projects.userProjects[params.stub] || {},
    timeline: get(syncTimeline, [params.stub, 'data'], []),
  }
}

const dispatchToProps = {
  getHistory,
}

const fetchConfigs = [{
  hasChanged: 'historyCacheKey',
  onChange: (props) => {
    props.getHistory({
      entityType: 'user',
      entityId: props.params.stub,
      cacheKey: props.historyCacheKey,
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserOverviewContainer extends Component {
  render() {
    return (
      <UserOverview {...this.props} />
    );
  }
}
