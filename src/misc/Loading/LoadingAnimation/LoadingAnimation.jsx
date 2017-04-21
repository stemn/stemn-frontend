import React, { Component, PropTypes } from 'react'
import classes from './LoadingAnimation.css'
import classNames from 'classnames'

export default class LoadingAnimation extends Component {
  render() {
    const { children, className } = this.props
    return (
      <div className={ classNames(classes.animation, className) }>
        { children }
      </div>
    )
  }
}
