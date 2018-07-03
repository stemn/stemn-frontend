import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import classes from './Crumb.scss'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'
import Link from 'stemn-shared/misc/Router/Link'

export default class Crumb extends Component {
  render() {
    const { text, ...otherProps } = this.props
    return (
      <Link className={ classNames(classes.crumb, 'link-primary') } { ...otherProps }>
        <span className={ classes.slash }>/</span>
        { middleConcat(text, 20, 0.6) }
      </Link>
    )
  }
}
