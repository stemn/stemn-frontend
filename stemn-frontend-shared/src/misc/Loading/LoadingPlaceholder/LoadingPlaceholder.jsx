import React, { Component, PropTypes } from 'react'
import classes from './LoadingPlaceholder.css'
import classNames from 'classnames'

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
        className={ classNames(classes.placeholder, className) }
        style={ Object.assign({}, sizeStyles, style) }
      >
        &nbsp;
      </div>
    )
  }
}
