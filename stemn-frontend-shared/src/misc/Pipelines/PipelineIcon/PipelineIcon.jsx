import React, { Component } from 'react'

import cn from 'classnames'
import s from './PipelineIcon.module.scss'
import { MdDone, MdPlayArrow as MdPlay, MdClose, MdStop, MdPause } from 'react-icons/md'
import { getStatusClass } from './PipelineIcon.utils'

export default class PipelineIcon extends Component {
  render() {
    const { status, ...otherProps } = this.props
    const classes = cn(s.outer, getStatusClass(status))
    if (status === 'success') {
      return (
        <div className={classes} {...otherProps}>
          <MdDone size={16} />
        </div>
      )
    } else if (status === 'running') {
      return (
        <div className={classes} {...otherProps}>
          <MdPlay size={16} />
        </div>
      )
    } else if (status === 'pending') {
      return (
        <div className={classes} {...otherProps}>
          <MdPause size={16} />
        </div>
      )
    } else if (status === 'skipped') {
      return (
        <div className={classes} {...otherProps}>
          <MdStop size={16} />
        </div>
      )
    } else if (status === 'failed') {
      return (
        <div className={classes} {...otherProps}>
          <MdClose size={16} />
        </div>
      )
    }
    return null
  }
}
