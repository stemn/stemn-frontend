import React, { Component, PropTypes } from 'react'

import classes from './SubHeader.css'
import classNames from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    noline: PropTypes.bool,
    style: PropTypes.object,
  }

  render() {
    const { title, children, noline, style } = this.props
    const borderStyle = noline ? {} : { borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }
    return (
      <div className={ classes.header } style={ Object.assign({}, borderStyle, style) }>
        <Container className={classNames(classes.headerInner, 'layout-row layout-align-start-center')}>
          <h1 className={ classes.title }>{ title }</h1>
          <div className='flex'></div>
          { children }
        </Container>
      </div>
    )
  }
}
