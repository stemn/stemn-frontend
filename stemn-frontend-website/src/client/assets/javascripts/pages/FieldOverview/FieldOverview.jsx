import React, { Component } from 'react'
import { Col, Row } from 'stemn-shared/misc/Layout'

import SiteSearchResults from 'stemn-shared/misc/Search/SiteSearchResults'
import RelatedList from 'stemn-shared/misc/RelatedFields/RelatedList'

export default class FieldOverview extends Component {
  render() {
    const { field, location } = this.props
    return (
      <Row className="layout-xs-col layout-gt-xs-row">
        <Col className="flex-gt-xs-70">
          <SiteSearchResults
            page={ parseInt(location.query.page) }
            parentType="field"
            parentId={ field.data._id }
            size={ 30 }
            type="project"
          />
        </Col>
        <Col className="flex-gt-xs-30">
          <div className="text-mini-caps" style={ { marginBottom: '10px' } }>Related Fields</div>
          <RelatedList fieldId={ field.data._id } limit={ 20 } />
        </Col>
      </Row>
    )
  }
}
