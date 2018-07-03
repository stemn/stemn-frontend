import React from 'react'

// Styles
import classNames from 'classnames'
import classes from './MoreDots.css'

export default class MoreDots extends React.Component {
  render() {
    return (
      <div className={ classNames(classes.moreDots, 'layout-row', { [classes.right]: this.props.side == 'right' }) }>
        <div />
        <div />
        <div />
      </div>
    )
  }
}
