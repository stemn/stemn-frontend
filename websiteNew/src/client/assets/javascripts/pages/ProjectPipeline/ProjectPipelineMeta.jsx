import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './ProjectPipeline.scss'

import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Row, Col } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'
import moment from 'moment'

export default ({ pipeline }) => {
  const userRouteParams = {
    userId: pipeline.user._id,
  }

  const fileParams = {
    projectId: pipeline.project._id,
    fileId: pipeline.fileId,
    revisionId: pipeline.revisionId,
  }
  
  return (
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
      <Col className={ classNames('sm layout-row', classes.buttonRow) }>
        <Button
          name="fileRoute"
          params={ fileParams }
          style={ { marginRight: '15px' } }
          className="light flex-xs"
        >
            Configuration
        </Button>
        <Button
          className="primary flex-xs"
        >
            Rerun Pipeline
        </Button>
      </Col>
    </Row>
    
  )
}

