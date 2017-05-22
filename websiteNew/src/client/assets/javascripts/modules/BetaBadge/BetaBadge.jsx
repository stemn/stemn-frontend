import React, { Component, PropTypes } from 'react'
import classes from './BetaBadge.scss'
import classNames from 'classnames'

export default class BetaBadge extends Component {
  render() {
    return (
      <div className={ classes.badge }>
        <div>B<span>eta</span></div>
      </div>
    )
  }
}
