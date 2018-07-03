import React, { Component } from 'react'

import classes from './PipelineList.css'
import PipelineRow from '../PipelineRow'

export default class PipelineList extends Component {
  render() {
    const { pipelines } = this.props
    return (
      <div className={ classes.outer }>
        { pipelines.map(pipelineId => <PipelineRow key={ pipelineId } pipelineId={ pipelineId } />)}
      </div>
    )
  }
}
