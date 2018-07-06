import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'stemn-shared/misc/Layout'

export default class PanelDescription extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const { title, children, description } = this.props
    return (
      <div>
        <div className="text-title-3">{ title }</div>
        <br />
        <Row className="layout-xs-column layout-gt-xs-row">
          <Col className="flex-xs-100 flex-gt-xs-40">
            <div className="text-title-5">
              { description }
            </div>
            <br />
          </Col>
          <Col className="flex">
            { children }
          </Col>
        </Row>
      </div>
    )
  }
}
