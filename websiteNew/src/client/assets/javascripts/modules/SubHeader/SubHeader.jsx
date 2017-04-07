import React, { Component, PropTypes } from 'react'

import classes from './SubHeader.css'
import classNames from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  render() {
    const { title, children } = this.props
    return (
      <div className={ classes.header }>
        <Container className={classNames(classes.headerInner, 'layout-row layout-align-start-center')}>
          <h1 className={ classes.title }>{ title }</h1>
          <div className='flex'></div>
          { children }
        </Container>
      </div>
    )
  }
}
