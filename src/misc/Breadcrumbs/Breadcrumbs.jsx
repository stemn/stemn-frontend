import React, { Component, PropTypes } from 'react'
import classNames from 'classnames';
import classes from './Breadcrumbs.css'

export default class Breadcrumbs extends Component {
  render() {
    return (
      <div className="layout-row">
        { this.props.children }
      </div>
    )
  }
}
