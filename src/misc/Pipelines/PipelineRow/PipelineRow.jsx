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
          name="David Revay"
          size={ 25 }
          shape="square"
        />
        <Link
          name="projectPipelineRoute"
          params={ { projectId, pipelineId } }
          className={ classes.title }
        >
          Build and email STL files <span className={ classes.number }>#P1234</span>
        </Link>
        <div className="flex" />
        <PipelineMiniMap pipeline={ pipeline.data }  />
      </div>
    )
  }
}
