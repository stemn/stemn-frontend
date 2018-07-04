import React from 'react'

// Styles
import classNames from 'classnames'
import classes from './Banner.css'

export default class Banner extends React.Component {
  render() {
    const { children, type, style } = this.props
    return (
      <div style={ style } className={ classNames(classes.banner, { [classes.warn]: type === 'warn' }) }>
        {children}
      </div>
    )
  }
}
