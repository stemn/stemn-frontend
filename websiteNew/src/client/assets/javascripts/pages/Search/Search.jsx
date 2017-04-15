import React, { Component, PropTypes } from 'react'

import SubHeader from 'modules/SubHeader'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'

import classes from './Search.scss'
import classNames from 'classnames'

export default class Search extends Component {
  render() {
    const { location, results } = this.props
    return (
      <StandardLayout>
        <SubHeader title="Results:">
          <Tabs noline style={ { height: '100%' } }>
            <Link to="/search" className={ { 'active' : !location.query.type} }>Projects</Link>
            <Link activeClassName="active" to="/search" query={{type: 'thread'}}>Threads</Link>
            <Link activeClassName="active" to="/search" query={{type: 'commit'}}>Commits</Link>
            <Link activeClassName="active" to="/search" query={{type: 'user'}}>People</Link>
            <Link activeClassName="active" to="/search" query={{type: 'field'}}>Fields</Link>
          </Tabs>
        </SubHeader>
        <Container className={ classes.content }>
          <Row className="layout-xs-col layout-gt-xs-row">
            <Col className="flex-60">
              { results.data.map((result) => (
                <div key={ result._id }>
                  { result.name }
                </div>
              )) }
            </Col>            
            <Col className="flex-40">
              Results
            </Col>
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}


