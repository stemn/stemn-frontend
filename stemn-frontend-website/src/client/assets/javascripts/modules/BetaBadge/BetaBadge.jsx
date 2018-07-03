import React, { Component } from 'react'
import classes from './BetaBadge.scss'
import classNames from 'classnames'

export default class BetaBadge extends Component {
  render() {
    return (
      <div className={ classes.badge }>
        <div className={ classes.arrow } />
        <div className={ classes.bubble }>B<span>eta</span></div>
      </div>
    )
  }
}
