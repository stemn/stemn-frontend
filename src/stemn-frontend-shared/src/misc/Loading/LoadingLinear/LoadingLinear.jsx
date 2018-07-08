import React, { Component } from 'react'
import classes from './LoadingLinear.css'
import cn from 'classnames'

export default class LoadingLinear extends Component {
  render() {
    const { type, className } = this.props
    const width = width >= 0 ? { width: `${width}%` } : {}
    return (
      <div className={ cn(classes.progress, className) }>
        <div className={ type === 'determinate' ? classes.determinate : classes.indeterminate } style={ width } />
      </div>
    )
  }
}
