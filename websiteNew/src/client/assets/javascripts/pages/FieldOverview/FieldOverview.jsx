import React, { Component } from 'react'
import { Col, Row } from 'stemn-shared/misc/Layout'

import SiteSearchResults from 'stemn-shared/misc/Search/SiteSearchResults'

export default class FieldOverview extends Component {
  render() {
    const { field, location } = this.props
    return (
      <Row className="layout-xs-col layout-gt-xs-row">
        <Col className="flex-70">
          <SiteSearchResults
            page={ location.query.page }
            parentType="field"
            parentId={ field.data._id }
            size={ 30 }
            type="project"
          />
        </Col>
        <Col className="flex-30">
          <div className="text-mini-caps">Related Fields</div>
        </Col>
      </Row>
    )
  }
}
