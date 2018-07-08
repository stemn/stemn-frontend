import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMapCurve.scss'

export default class PipelineMapCurve extends Component {
  render() {
    const { side, connectTo } = this.props

    return (
      <div className={ cn(classes.line, side === 'left' ? classes.left : classes.right) }>
        { connectTo === 0 && <div className={ side === 'left' ? classes.horizLeft : classes.horizRight } /> }
        { connectTo > 0 && [
          <div key="vert" className={ side === 'left' ? classes.vertLeft : classes.vertRight } />,
          <div key="bottom" className={ side === 'left' ? classes.bottomLeft : classes.bottomRight } />,
        ]}
      </div>
    )
  }
}
