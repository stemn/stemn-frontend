import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';
import { getPipeline } from 'stemn-shared/misc/Pipelines/Pipelines.actions.js'
import ProjectPipelineStep from './ProjectPipelineStep'

const stateToProps = ({ projects, pipelines }, { params }) => {
  const projectId = params.stub;
  const pipelineId = params.pipelineId;
  const project = projects.data[projectId];
  const pipeline = pipelines.pipelineData[pipelineId];

  return {
    project,
    projectId,
    pipelineId,
    pipeline,
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
