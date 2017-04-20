import React, { Component, PropTypes } from 'react'

import classes from './SubHeader.css'
import classNames from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    noline: PropTypes.bool,
    style: PropTypes.object,
    icon: PropTypes.node,
  }

  render() {
    const { title, children, noline, icon, style } = this.props
    const borderStyle = noline ? {} : { borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }
    return (
      <div className={ classes.header } style={ Object.assign({}, borderStyle, style) }>
        <Container className={classNames(classes.headerInner, 'layout-xs-column layout-sm-column layout-gt-sm-row layout-align-xs-end layout-align-sm-end')}>
          <h1 className={ classNames(classes.title, 'layout-row layout-align-start-center') }>
            { icon }
            { title }
          </h1>
          { title && <div className="flex"></div> }
          { children }
        </Container>
      </div>
    )
  }
}
