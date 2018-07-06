import React, { Component } from 'react'
import classes from './LoadingPlaceholder.css'
import cn from 'classnames'

export default class LoadingPlaceholder extends Component {
  static defaultProps = {
    width: 200,
  }
  render() {
    const { width, className, style } = this.props
    const sizeStyles = {
      width: `${width}px`,
    }
    return (
      <div
        className={ cn(classes.placeholder, className) }
        style={ Object.assign({}, sizeStyles, style) }
      >
        &nbsp;
      </div>
    )
  }
}
