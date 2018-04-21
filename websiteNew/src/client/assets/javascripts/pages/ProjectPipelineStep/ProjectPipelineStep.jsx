import React, { Component } from 'react'

import classes from './ProjectPipelineStep.scss'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import Terminal from 'stemn-shared/misc/Terminal/Terminal'
import ProjectPipelineMeta from '../ProjectPipeline/ProjectPipelineMeta.container'
import BannerBar from 'stemn-shared/misc/BannerBar'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable'
import { diffTimes } from 'stemn-shared/misc/Date/Date.utils'

export default class ProjectPipelineStep extends Component {
  renderLoaded() {
    const { pipeline, step, stepId, projectId } = this.props

    if (!pipeline || !pipeline.data || !step || !step.data) {
      return null
    }

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectPipelinesRoute" params={ { projectId } } text="Pipelines" />
            <Crumb name="projectPipelineRoute" params={ { projectId, pipelineId: pipeline.data._id } } text={ pipeline.data.name } />
            <Crumb text={ step.data.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <span>{ step.data.name }</span>
            <span className={ classes.number }>&nbsp;#S{ step.data.stepNumber }</span>
          </h2>
          <ProjectPipelineMeta pipeline={ pipeline } />
        </SubSubHeader>
        <Container>
          <br />
          <BannerBar type="success">
            <SimpleTable>
              <tr><td>Image:</td><td>{ step.data.image }</td></tr>
              <tr><td>Duration:</td><td>{ diffTimes(pipeline.data.start, pipeline.data.end || new Date())}</td></tr>
              <tr><td>Status:</td><td>{ step.data.status }</td></tr>
              <tr><td>Command:</td><td>{ step.data.command }</td></tr>
            </SimpleTable>
          </BannerBar>
          <br />
          <Terminal pipelineId={ pipeline.data._id } stepId={ stepId } /> 
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
