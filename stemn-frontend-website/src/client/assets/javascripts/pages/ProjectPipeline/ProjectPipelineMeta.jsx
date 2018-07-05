import React from 'react'

import cn from 'classnames'
import classes from './ProjectPipeline.scss'

import { get } from 'lodash'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Row, Col } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'
import moment from 'moment'
import IsOwner from 'stemn-shared/misc/Auth/IsOwner'

export default ({ pipeline, project, rerunPipeline, cancelPipeline }) => {
  const userRouteParams = {
    userId: pipeline.data.owner._id,
  }

  const fileParams = {
    projectId: pipeline.data.project._id,
    fileId: pipeline.data.fileId,
    revisionId: pipeline.data.revisionId,
  }
  
  return (
    <Row className="sm layout-xs-column layout-gt-xs-row">
      <Col className={ cn('sm layout-row layout-align-start-center', classes.meta) }>
        <Link
          name="userRoute"
          params={ userRouteParams }
          className="layout-row layout-align-start-center"
        >
          <UserAvatar
            className={ classes.avatar }
            name={ pipeline.data.owner.name }
            picture={ pipeline.data.owner.picture }
            size={ 20 }
            shape="square"
          />
          <b className="text-ellipsis">{ pipeline.data.owner.name }</b>
        </Link>
        <div className="text-ellipsis">&nbsp;triggered this pipeline { moment(pipeline.data.start).fromNow() }.</div>
      </Col>
      <div className="flex" />
      <Col className={ cn('sm layout-row', classes.buttonRow) }>
        <Button
          name="fileRoute"
          params={ fileParams }
          style={ { marginRight: '15px' } }
          className="light flex-xs"
        >
            Configuration
        </Button>
        <IsOwner
          team={ get(project, 'data.team', []) }
          minRole="admin"
        >
          { ['running', 'pending'].includes(pipeline.data.status) 
            ? (
              <Button
                disabled={ pipeline.cancelPending }
                onClick={ () => cancelPipeline({ pipelineId: pipeline.data._id }) }
                className="warn flex-xs"
              >
                  Cancel Pipeline
              </Button>
            ) 
            : (
              <Button
                disabled={ pipeline.rerunPending }
                onClick={ () => rerunPipeline({ pipelineId: pipeline.data._id }) }
                className="primary flex-xs"
              >
                  Rerun Pipeline
              </Button>
            )
          }
        </IsOwner>
      </Col>
    </Row>
    
  )
}

