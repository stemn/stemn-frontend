import React, { Component } from 'react'

import classes from './TextSwitch.css'

export default class TextSwitch extends Component {
  render() {
    const { children, swap, height } = this.props

    const outerStyle = {
      height: `${height}px`,
    }
    const innerStyle = swap ? {
      transform: `translateY(-${height}px)`,
    } : {}
    return (
      <div className={ classes.outer } style={ outerStyle }>
        <div className={ classes.inner } style={ innerStyle }>
          { children }
        </div>
      </div>
    )
  }
}

