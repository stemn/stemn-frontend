
import React, { Component } from 'react'

import cn from 'classnames'
import s from './PipelineIcon.scss'
import MdDone from 'react-icons/md/done'
import MdPlay from 'react-icons/md/play-arrow'
import MdClose from 'react-icons/md/close'
import MdStop from 'react-icons/md/stop'
import MdPause from 'react-icons/md/pause'

export const getStatusClass = (status) => {
  if (status === 'success') {
    return s.success
  } else if (status === 'running') {
    return s.running
  } else if (status === 'pending') {
    return s.pending
  } else if (status === 'skipped') {
    return s.pending
  } else if (status === 'failed') {
    return s.error
  }
}

export default class PipelineIcon extends Component {
  render() {
    const { status, ...otherProps } = this.props
    const classes = cn(s.outer, getStatusClass(status))
    if (status === 'success') {
      return <div className={ classes } { ...otherProps }><MdDone size={ 16 } /></div>
    } else if (status === 'running') {
      return <div className={ classes } { ...otherProps }><MdPlay size={ 16 } /></div>
    } else if (status === 'pending') {
      return <div className={ classes } { ...otherProps }><MdPause size={ 16 } /></div>
    } else if (status === 'skipped') {
      return <div className={ classes } { ...otherProps }><MdStop  size={ 16 } /></div>
    } else if (status === 'failed') {
      return <div className={ classes } { ...otherProps }><MdClose  size={ 16 } /></div>
    }
    return null
  }
}
