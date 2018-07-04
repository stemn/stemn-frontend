import React, { Component } from 'react'
import classes from './LoadingAnimation.css'
import cn from 'classnames'

export default class LoadingAnimation extends Component {
  render() {
    const { children, className } = this.props
    return (
      <div className={ cn(classes.animation, className) }>
        { children }
      </div>
    )
  }
}
