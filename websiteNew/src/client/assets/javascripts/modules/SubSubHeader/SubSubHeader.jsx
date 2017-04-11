import React, { Component, PropTypes } from 'react'

import classes from './SubSubHeader.css'
import classNames from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'

export default class SubHeader extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { title, children } = this.props
    return (
      <div className={ classes.header }>
        <Container>
          <div className={ classes.headerBorder }/>
          { children }
        </Container>
      </div>
    )
  }
}
