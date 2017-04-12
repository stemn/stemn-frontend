import React, { Component, PropTypes } from 'react';

import LandingHeader from 'modules/LandingHeader'

export default class LandingLayout extends Component {
  render() {
    const { children, className, ...otherProps } = this.props;
    return (
      <div className="layout-column flex" { ...otherProps }>
        <LandingHeader />
        { children }
      </div>
    )
  }
}
