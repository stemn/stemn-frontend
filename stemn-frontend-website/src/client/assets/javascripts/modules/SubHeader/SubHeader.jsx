import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './SubHeader.css'
import cn from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
    noline: PropTypes.bool,
    style: PropTypes.object,
    noResponsive: PropTypes.bool,
  }

  render() {
    const {
      title,
      children,
      noline,
      style,
      noResponsive,
    } = this.props
    const borderStyle = noline ? {} : { borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }
    const responsiveClasses = noResponsive
      ? 'layout-row'
      : 'layout-xs-column layout-sm-column layout-gt-sm-row layout-align-xs-end layout-align-sm-end'

    return (
      <div className={ classes.header } style={ Object.assign({}, borderStyle, style) }>
        <Container className={ cn(classes.headerInner, responsiveClasses) }>
          <h1 className={ cn(classes.title, 'layout-row layout-align-start-center') }>
            { title }
          </h1>
          { title && <div className="flex" /> }
          <div className="layout-row">
            { children }
          </div>
        </Container>
      </div>
    )
  }
}
