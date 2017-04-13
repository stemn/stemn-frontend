import React, { Component, PropTypes } from 'react';

import LandingHeader from 'modules/LandingHeader'
import LandingFooter from 'modules/LandingFooter'

export default class LandingLayout extends Component {
  render() {
    const { children, className, ...otherProps } = this.props;
    return (
      <div className="layout-column flex" { ...otherProps }>
        <LandingHeader />
        <div className="flex">
          { children }
        </div>
        <LandingFooter />
      </div>
    )
  }
}
