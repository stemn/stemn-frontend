import React, { Component, PropTypes } from 'react'
import Header from 'modules/Header'
import Footer from 'modules/Footer'
import ScrollToTop from 'stemn-shared/misc/Scroll/ScrollToTop'

import classNames from 'classnames'
import { Container } from 'stemn-shared/misc/Layout'

class StandardLayout extends Component {
  renderInner(children, contained, style, className) {
    if (contained) {
      return (
        <Container style={ style } className={ className }>
          { children }
        </Container>
      )
    } 
    return this.props.children
  }
  render() {
    const { children, contained, className, style, nofooter, ...otherProps } = this.props
    const standardClasses = 'layout-column flex'
    return (
      <div className={ classNames(standardClasses) } { ...otherProps }>
        <Header />
        <ScrollToTop />
        <div className="flex layout-column">
          { this.renderInner(children, contained, style, className) }
        </div>
        { nofooter
          ? null
          : <Footer /> }
      </div>
    )
  }
}

export default StandardLayout
