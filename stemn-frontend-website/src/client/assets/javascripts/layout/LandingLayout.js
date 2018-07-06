import React, { Component } from 'react'

import LandingHeader from 'modules/LandingHeader'
import LandingFooter from 'modules/LandingFooter'
import ScrollToTop from 'stemn-shared/misc/Scroll/ScrollToTop'

export default class LandingLayout extends Component {
  render() {
    const { children, className, ...otherProps } = this.props
    return (
      <div className="layout-column flex" { ...otherProps }>
        <LandingHeader />
        <ScrollToTop />
        <div className="flex" style={ { overflow: 'hidden' } }>
          { children }
        </div>
        <LandingFooter />
      </div>
    )
  }
}
