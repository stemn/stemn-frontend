import React, { Component } from 'react'

import classes from './ProjectPipeline.scss'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import PipelineMap from 'stemn-shared/misc/Pipelines/PipelineMap'
import PipelineIcon from 'stemn-shared/misc/Pipelines/PipelineIcon'
import ProjectPipelineMeta from './ProjectPipelineMeta.container'

export default class ProjectCommit extends Component {
  renderLoaded() {
    const { pipeline, project } = this.props    

    if (!pipeline || !pipeline.data) {
      return null
    }

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectPipelinesRoute" params={ { projectId: project.data._id } } text="Pipelines" />
            <Crumb text={ pipeline.data.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <PipelineIcon status={ pipeline.data.status } />
            <span>{ pipeline.data.name }</span>
            <span className={ classes.number }>&nbsp;#P{ pipeline.data.pipelineNumber }</span>
          </h2>
          <ProjectPipelineMeta pipeline={ pipeline } />
        </SubSubHeader>
        <Container>
          <br />
          <br />
          <PipelineMap pipeline={ pipeline.data } />
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
