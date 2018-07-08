import React, { Component } from 'react'

import classes from './ProjectPipeline.scss'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import PipelineMap from 'stemn-shared/misc/Pipelines/PipelineMap'
import ProjectPipelineMeta from './ProjectPipelineMeta.container'
import BannerBar from 'stemn-shared/misc/BannerBar'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable'
import { diffTimes } from 'stemn-shared/misc/Date/Date.utils'

export default class ProjectCommit extends Component {
  // Force fresh every second so timer updates
  refreshInterval = null
  componentDidMount() {
    this.refreshInterval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.refreshInterval)    
  }
  renderLoaded() {
    const { pipeline, project, projectId } = this.props    

    if (!pipeline || !pipeline.data) {
      return null
    }

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectPipelinesRoute" params={ { projectId } } text="Pipelines" />
            <Crumb text={ pipeline.data.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <span>{ pipeline.data.name }</span>
            <span className={ classes.number }>&nbsp;#P{ pipeline.data.pipelineNumber }</span>
          </h2>
          <ProjectPipelineMeta pipeline={ pipeline } project={ project } />
        </SubSubHeader>
        <Container>
          <BannerBar style={ { margin: '20px 0' } }>
            <SimpleTable>
              <tr><td>Duration:</td><td>{ diffTimes(pipeline.data.start, pipeline.data.end || new Date())}</td></tr>
              <tr><td>Status:</td><td style={ { textTransform: 'capitalize' } }>{ pipeline.data.status }</td></tr>
              { pipeline.data.error && pipeline.data.error.message &&
                <tr><td>Error</td><td>{ pipeline.data.error.message }</td></tr>
              }
            </SimpleTable>
          </BannerBar>
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
