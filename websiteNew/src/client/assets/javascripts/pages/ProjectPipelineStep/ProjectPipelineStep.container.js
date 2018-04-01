import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';
import { getPipeline, joinStepRoom, leaveStepRoom } from 'stemn-shared/misc/Pipelines/Pipelines.actions'
import { findStep } from 'stemn-shared/misc/Pipelines/Pipelines.utils'
import ProjectPipelineStep from './ProjectPipelineStep'
import { has } from 'lodash'


const stateToProps = ({ projects, pipelines }, { params }) => {
  const projectId = params.stub;
  const pipelineId = params.pipelineId;
  const project = projects.data[projectId];
  const pipeline = pipelines.pipelineData[pipelineId];

  const stepId = params.stepId
  const step = has(pipeline, 'data.stages')
    ? findStep(pipeline.data.stages, stepId)
    : undefined

  return {
    project,
    projectId,
    pipelineId,
    pipeline,
    step,
    stepId,
  };
}

const dispatchToProps = {
  getPipeline,
  joinStepRoom,
  leaveStepRoom,
};

const fetchConfigs = [{
  hasChanged: 'pipelineId',
  onChange: ({ getPipeline, pipelineId }) => getPipeline({ pipelineId })
}, {
  hasChanged: 'stepId',
  onChange: ({ joinStepRoom, stepId }) => joinStepRoom({ stepId })
}, {
  unmount: true,
  hasChanged: 'stepId',
  onChange: (nextProps, prevProps) => {
    // We leave the prevRoom if there is a prev threadId
    if (prevProps.leaveStepRoom && prevProps.stepId) {
      prevProps.leaveStepRoom({
        stepId: prevProps.stepId,
      })
    }
  }
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


