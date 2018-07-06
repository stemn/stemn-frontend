import React from 'react'

// Styles
import cn from 'classnames'
import classes from './Banner.css'

export default class Banner extends React.Component {
  render() {
    const { children, type, style } = this.props
    return (
      <div style={ style } className={ cn(classes.banner, { [classes.warn]: type === 'warn' }) }>
        {children}
      </div>
    )
  }
}
