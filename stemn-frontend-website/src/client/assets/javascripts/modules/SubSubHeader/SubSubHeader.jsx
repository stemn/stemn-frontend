import React, { Component } from 'react'
import classes from './SubSubHeader.module.css'
import cn from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  render() {
    const { title, children, className, ...otherProps } = this.props
    return (
      <div className={cn(classes.header, className)} {...otherProps}>
        <Container>
          <div className={classes.headerBorder} />
          {children}
        </Container>
      </div>
    )
  }
}
