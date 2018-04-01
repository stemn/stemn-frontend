import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './ProjectPipeline.scss'

import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import SubSubHeader from 'modules/SubSubHeader'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import PipelineMap from 'stemn-shared/misc/Pipelines/PipelineMap'
import Link from 'stemn-shared/misc/Router/Link'
import moment from 'moment'

export default class ProjectCommit extends Component {
  renderLoaded() {
    const { pipeline: { data: pipeline }, project } = this.props    

    if (!pipeline) {
      return null
    }

    const userRouteParams = {
      userId: pipeline.user._id
    }

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectPipelinesRoute" params={ { projectId: project.data._id } } text="Pipelines" />
            <Crumb text={ pipeline.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <span>{ pipeline.name }</span>
            <span className={ classes.number }>&nbsp;#P{ pipeline.pipelineNumber }</span>
          </h2>
          <Row className="sm layout-xs-column layout-gt-xs-row">
            <Col className={ classNames('sm layout-row layout-align-start-center', classes.meta) }>
              <Link
                name="userRoute"
                params={ userRouteParams }
                className="layout-row layout-align-start-center"
              >
                <UserAvatar
                  className={ classes.avatar }
                  name={ pipeline.user.name }
                  picture={ pipeline.user.picture }
                  size={ 20 }
                  shape="square"
                />
                <b className="text-ellipsis">{ pipeline.user.name }</b>
              </Link>
              <div className="text-ellipsis">&nbsp;manually triggered this pipeline { moment(pipeline.started).fromNow() }.</div>
            </Col>
            <div className="flex" />
            <Col className={ classNames('sm layout-column', classes.buttonRow) }>
              <Button
                className="primary"
              >
                Rerun Pipeline
              </Button>
            </Col>
          </Row>
        </SubSubHeader>
        <Container>
          <br />
          <br />
          <PipelineMap pipeline={ pipeline } />
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
