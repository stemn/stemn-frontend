import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import ProjectCommits from './ProjectCommits'
import { push } from 'react-router-redux'

const stateToProps = ({ projects, syncTimeline }, { params, location }) => {
  return {
    project: projects.data[params.stub],
    projectId: params.stub,
    syncTimeline: syncTimeline[params.stub],
    filterValue: location.query.filter || 'commits',
  };
}
        
const dispatchToProps = {
  fetchTimeline,
  push,
};

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.fetchTimeline({
      entityType: 'project',
      entityId: props.projectId,
    })
  }
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectCommitsContainer extends Component {
  render() {
    return (
      <ProjectCommits {...this.props} />
    );
  }
}
