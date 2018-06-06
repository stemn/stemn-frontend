import React, { Component } from 'react'
import moment from 'moment'
import classes from './ProjectPipelineStep.scss'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import Terminal from 'stemn-shared/misc/Terminal/Terminal'
import ProjectPipelineMeta from '../ProjectPipeline/ProjectPipelineMeta.container'
import BannerBar from 'stemn-shared/misc/BannerBar'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable'
import { diffTimes } from 'stemn-shared/misc/Date/Date.utils'
import Link from 'stemn-shared/misc/Router/Link'

const getImageUrl = (imageName) => {
  const splitName = imageName.split('/')
  if (splitName.length === 1) {
    return `https://hub.docker.com/_/${imageName}/` 
  } else if (splitName.length === 2) {
    return `https://hub.docker.com/r/${imageName}/`                   
  }
  return imageName
}

export default class ProjectPipelineStep extends Component {
  // Force fresh every second so timer updates
  refreshInterval = null
  componentDidMount() {
    this.refreshInterval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.refreshInterval)    
  }
  renderLoaded() {
    const { pipeline, step, stepId, projectId, project } = this.props

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
          <ProjectPipelineMeta pipeline={ pipeline } project={ project } />
        </SubSubHeader>
        <Container>
          <BannerBar style={ { margin: '20px 0' } }>
            <div className="layout-gt-xs-row layout-xs-column">
              <div className="flex">
                <SimpleTable >
                  <tr><td>Status:</td><td style={ { textTransform: 'capitalize' } }>{ step.data.status }</td></tr>
                  { step.data.start && <tr><td>Start:</td><td>{ moment(step.data.start).fromNow() }</td></tr> }
                  { step.data.start && <tr><td>Duration:</td><td>{ diffTimes(step.data.start, step.data.end || new Date())}</td></tr> }
                  <tr>
                    <td>Pipeline:</td>
                    <td>
                      <Link name="projectPipelineRoute" params={ { projectId, pipelineId: pipeline.data._id } }>#P{ pipeline.data.pipelineNumber }</Link>
                    </td>
                  </tr>
                </SimpleTable>
              </div>
              <div className="flex hide-xs">
                <SimpleTable>
                  <tr>  
                    <td>Image:</td>
                    <td><a href={ getImageUrl(step.data.image) } target="blank">{ step.data.image }</a></td>
                  </tr>
                  { step.data.command && <tr>
                    <td>Command:</td>
                    <td>{ Array.isArray(step.data.command) 
                      ? step.data.command.map(command => <code className={ classes.code }>{command}</code>) 
                      : <code className={ classes.code }>{step.data.command}</code>
                    }</td>
                  </tr> }
                </SimpleTable>
              </div>
            </div>
          </BannerBar>
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
