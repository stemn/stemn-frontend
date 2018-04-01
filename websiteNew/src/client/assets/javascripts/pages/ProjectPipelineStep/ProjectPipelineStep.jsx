import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './ProjectPipelineStep.css'

import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import SubSubHeader from 'modules/SubSubHeader'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import Terminal from 'stemn-shared/misc/Terminal/Terminal'

export default class ProjectPipelineStep extends Component {
  renderLoaded() {
    const { pipeline: { data: pipeline }, project, step } = this.props

    if (!pipeline || !step) {
      return null
    }

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectPipelinesRoute" params={ { projectId: project.data._id } } text="Pipelines" />
            <Crumb name="projectPipelineRoute" params={ { projectId: project.data._id, pipelineId: pipeline._id } } text={ pipeline.name } />
            <Crumb text={ step.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <span>{ step.name }</span>
            <span className={ classes.number }>&nbsp;#S{ step.stepNumber }</span>
          </h2>
          <div className={ classes.blurb }>
            <EditorDisplay value={ pipeline.body } />
          </div>
          <div className={ classNames('layout-row layout-align-start-center', classes.meta) }>
            <Link
              name="userRoute"
              params={ { userId: pipeline.user._id } }
            >
              <UserAvatar
                className={ classes.avatar }
                name={ pipeline.user.name }
                picture={ pipeline.user.picture }
                size={ 20 }
                shape="square"
              />
            </Link>
            <div className="text-ellipsis">
              <Link
                name="userRoute"
                params={ { userId: pipeline.user._id } }
              >
                <b>{ pipeline.user.name }</b>
              </Link>
              &nbsp;triggered this pipeline 3.2 hours ago.
            </div>
          </div>
        </SubSubHeader>
        <Container>
          <br />
          <br />
          <Terminal pipelineId={ pipeline._id } stepId={ step._id } /> 
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
