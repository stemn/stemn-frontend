import React, { Component, PropTypes } from 'react'

import classes from './SubSubHeader.css'
import classNames from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { title, children, className, ...otherProps } = this.props
    return (
      <div className={ classNames(classes.header, className) } { ...otherProps }>
        <Container>
          <div className={ classes.headerBorder }/>
          { children }
        </Container>
      </div>
    )
  }
}
