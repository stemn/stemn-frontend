
import React, { Component } from 'react'

import cn from 'classnames'
import s from './PipelineIcon.scss'
import MdDone from 'react-icons/md/done'
import MdPlay from 'react-icons/md/play-arrow'
import MdClose from 'react-icons/md/close'
import MdStop from 'react-icons/md/stop'

export default class pipelineIcon extends Component {
  render() {
    const { status, ...otherProps } = this.props
    if (status === 'success') {
      return <div className={ cn(s.outer, s.success) } { ...otherProps }><MdDone size={ 16 } /></div>
    } else if (status === 'running') {
      return <div className={ cn(s.outer, s.running) } { ...otherProps }><MdPlay size={ 16 } /></div>
    } else if (status === 'pending') {
      return <div className={ cn(s.outer, s.pending) } { ...otherProps }><MdStop size={ 16 } /></div>
    } else if (status === 'error') {
      return <div className={ cn(s.outer, s.error) } { ...otherProps }><MdClose  size={ 16 } /></div>
    }
    return null
  }
}
