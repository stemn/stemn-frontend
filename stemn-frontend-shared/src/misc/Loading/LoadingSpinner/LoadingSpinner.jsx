import React, { Component } from 'react'

// Styles
import cn from 'classnames'
import classes from './LoadingSpinner.css'

export default class LoadingSpinner extends Component {
  render() {
    const { size, progress } = this.props

    const width = 50
    const total = 124
    const isProgress = progress && progress > 0 && progress < 1

    const progressStyle = isProgress ? { strokeDasharray: `${total * progress}, 200` } : {}

    const getTransformStyle = () => {
      if (size === 'xs') {
        return { transform: 'scale(0.2)' }
      } else if (size === 'sm') {
        return { transform: 'scale(0.5)' }
      }
    }

    const transformStyle = getTransformStyle()

    return (
      <div className={ cn(classes.loader, isProgress ? classes.progress : classes.animate) } style={ transformStyle }>
        <svg className={ classes.circular } viewBox={ `${width / 2} ${width / 2} ${width} ${width}` }>
          <circle className={ classes.path } cx={ width } cy={ width } r={ width / 2 - 5 } fill="none" strokeWidth="2" strokeMiterlimit="10" style={ progressStyle } />
        </svg>
      </div>
    )
  }
}
