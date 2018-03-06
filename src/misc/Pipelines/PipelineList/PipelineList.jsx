import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './PipelineList.css'
import PipelineRow from '../PipelineRow'

export default class PipelineList extends Component {
  render() {
    return (
      <div className={ classes.outer }>
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
        <PipelineRow />
      </div>
    )
  }
}
