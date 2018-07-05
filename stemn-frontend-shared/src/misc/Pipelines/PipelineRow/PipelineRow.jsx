import React, { Component } from 'react'
import moment from 'moment'
import classes from './PipelineRow.scss'
import cn from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'
import PipelineMiniMap from '../PipelineMiniMap'
import { diffTimes } from 'stemn-shared/misc/Date/Date.utils'

export default class ThreadRow extends Component {
  // Force fresh every second so timer updates
  refreshInterval = null
  componentDidMount() {
    this.refreshInterval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.refreshInterval)    
  }
  render() {
    const { pipeline, className } = this.props

    if (pipeline && pipeline.data) {
      const pipelineRouteParams = { 
        projectId: pipeline.data.project._id,
        pipelineId: pipeline.data._id,
      }

      return (
        <div className={ cn('layout-row layout-align-start-center', classes.row, className) }>
          <div className="layout-column flex">
            <Link
              className={ cn(classes.title, 'text-ellipsis') }
              name="projectPipelineRoute"
              params={ pipelineRouteParams }
            >
              { pipeline.data.name }
              { pipeline.data.pipelineNumber && <span className={ classes.pipelineNumber }>&nbsp;#P{ pipeline.data.pipelineNumber }</span> }
            </Link>
            <div className={ cn(classes.meta, 'text-ellipsis') }>
              { pipeline.data.start && <span>Triggered {moment(pipeline.data.start).fromNow()}</span> }
              { pipeline.data.start && <span className="text-interpunct" /> }
              { pipeline.data.start && <span className="text-grey-2">Duration: { diffTimes(pipeline.data.start, pipeline.data.end || new Date()) }</span> }
            </div>
          </div>
          <PipelineMiniMap pipeline={ pipeline.data }  />
          <div className={ classes.asignees }>
            <UserAvatars
              className="layout-row"
              users={ [pipeline.data.owner] }
              limit={ 3 }
              shape="square"
            />
          </div>
        </div>
      )
    }

    return (
      <LoadingAnimation className={ cn('layout-row layout-align-start-center', classes.row, className) }>
        <div className="layout-column flex">
          <div>
            <LoadingPlaceholder width={ 300 } className={ classes.title } />
          </div>
          <div className={ cn(classes.meta, 'layout-row') }>
            <LoadingPlaceholder width={ 50 } />
            <LoadingPlaceholder width={ 50 } style={ { marginLeft: '5px' } } />
          </div>
        </div>
        <UserAvatars
          users={ [{}] }
          limit={ 3 }
          shape="square"
        />
      </LoadingAnimation>
    )
  }
}
