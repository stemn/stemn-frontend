import React, { Component } from 'react'

export default class Breadcrumbs extends Component {
  render() {
    return (
      <div className="layout-row">
        { this.props.children }
      </div>
    )
  }
}
