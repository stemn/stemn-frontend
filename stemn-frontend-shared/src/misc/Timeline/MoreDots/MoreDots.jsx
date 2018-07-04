import React from 'react'

// Styles
import cn from 'classnames'
import classes from './MoreDots.css'

export default class MoreDots extends React.Component {
  render() {
    return (
      <div className={ cn(classes.moreDots, 'layout-row', { [classes.right]: this.props.side === 'right' }) }>
        <div />
        <div />
        <div />
      </div>
    )
  }
}
