import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './SubSubHeader.css'
import cn from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { title, children, className, ...otherProps } = this.props
    return (
      <div className={ cn(classes.header, className) } { ...otherProps }>
        <Container>
          <div className={ classes.headerBorder } />
          { children }
        </Container>
      </div>
    )
  }
}
