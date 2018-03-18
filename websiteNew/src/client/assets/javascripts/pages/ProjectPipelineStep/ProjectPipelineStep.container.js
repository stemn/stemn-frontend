import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';
import { getPipeline } from 'stemn-shared/misc/Pipelines/Pipelines.actions.js'
import ProjectPipelineStep from './ProjectPipelineStep'

const stateToProps = ({ projects, pipelines }, { params }) => {
  const projectId = params.stub;
  const piplineId = params.piplineId;
  const project = projects.data[projectId];
  // const pipeline = pipelines.pipelines[piplineId];

  return {
    project,
    projectId,
    piplineId,
    pipeline: {
      data: {
        name: 'Build CAD files and send them!',
        pipelineNumber: 32,
        user: {
          id: 'asfasffas',
          name: 'David Revay',
        }
      },
      loading: false,
    },
  };
}

const dispatchToProps = {
  getPipeline,
};

const fetchConfigs = [{
  hasChanged: 'pipelineId',
  onChange: ({ getPipeline, pipelineId }) => getPipeline({ pipelineId })
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectPipelineStepContainer extends Component {
  render() {
    return (
      <ProjectPipelineStep {...this.props} />
    );
  }
}
