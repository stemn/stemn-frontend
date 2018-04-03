import React, { Component } from 'react'

import classes from './ProjectPipelineStep.scss'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import Terminal from 'stemn-shared/misc/Terminal/Terminal'
import PipelineIcon from 'stemn-shared/misc/Pipelines/PipelineIcon'
import ProjectPipelineMeta from '../ProjectPipeline/ProjectPipelineMeta'

export default class ProjectPipelineStep extends Component {
  renderLoaded() {
    const { pipeline: { data: pipeline }, project, step, stepId } = this.props

    if (!pipeline || !step || !step.data) {
      return null
    }

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectPipelinesRoute" params={ { projectId: project.data._id } } text="Pipelines" />
            <Crumb name="projectPipelineRoute" params={ { projectId: project.data._id, pipelineId: pipeline._id } } text={ pipeline.name } />
            <Crumb text={ step.data.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <PipelineIcon status={ step.data.status } />
            <span>{ step.data.name }</span>
            <span className={ classes.number }>&nbsp;#S{ step.data.stepNumber }</span>
          </h2>
          <ProjectPipelineMeta pipeline={ pipeline } />
        </SubSubHeader>
        <Container>
          <br />
          <br />
          <Terminal pipelineId={ pipeline._id } stepId={ stepId } /> 
        </Container>
      </div>
    )
  }
  render() {
    const { pipeline } = this.props

    return (
      <div className={ classes.content }>
        { pipeline && pipeline.data 
          ? this.renderLoaded()
          : null }
      </div>
    )
  }
}
