import React from 'react'
import classes from './TextDisplayBox.css'
import cn from 'classnames'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default class TextDisplayBox extends React.Component {
  render() {
    const { className, disabled, children, ...otherProps } = this.props
    return (
      <div className={ cn(classes.box, 'layout-row layout-align-start-center', { [classes.disabled]: disabled }, className) } { ...otherProps } >
        { children }
      </div>
    )
  }
}
