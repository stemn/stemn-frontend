import React, { Component, PropTypes } from 'react';

import LandingHeader from 'modules/LandingHeader'
import Footer from 'modules/Footer'

export default class LandingLayout extends Component {
  render() {
    const { children, className, ...otherProps } = this.props;
    return (
      <div className="layout-column flex" { ...otherProps }>
        <LandingHeader />
        <div className="flex">
          { children }
        </div>
        <Footer />
      </div>
    )
  }
}
