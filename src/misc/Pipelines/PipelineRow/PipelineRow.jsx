import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './PipelineRow.scss'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import PipelineMiniMap from '../PipelineMiniMap'
import Link from 'stemn-shared/misc/Router/Link'


export default class PipelineRow extends Component {
  render() {
    const { pipeline } = this.props
    const { project: { _id: projectId }, _id: pipelineId } = pipeline.data
    return (
      <div className={ classNames(classes.row, 'layout-row layout-align-start-center') }>
        <UserAvatar
          style={ { marginRight: '10px' } }
          name={ pipeline.data.user.name }
          picture={ pipeline.data.user.picture }
          size={ 25 }
          shape="square"
        />
        <Link
          name="projectPipelineRoute"
          params={ { projectId, pipelineId } }
          className={ classNames(classes.title, 'text-ellipsis') }
        >
          {pipeline.data.name} <span className={ classes.number }>#P{pipeline.data.pipelineNumber}</span>
        </Link>
        <div className="flex" />
        <PipelineMiniMap pipeline={ pipeline.data }  />
      </div>
    )
  }
}
