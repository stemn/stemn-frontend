import React, { Component, PropTypes } from 'react'

import SubHeader from 'modules/SubHeader'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'
import SiteSearchResult from 'stemn-shared/misc/Search/SiteSearchResult'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Pagination from 'stemn-shared/misc/Pagination'

import classes from './Search.scss'
import classNames from 'classnames'

export default class Search extends Component {
  render() {
    const { location, results, page, size } = this.props
    const noMoreResults = results && results.data && results.data.length < size

    return (
      <StandardLayout>
        <SubHeader>
          <Tabs noline style={ { height: '100%' } }>
            <Link to="/search" className={ { 'active' : !location.query.type} } query={{q: results.query}}>Projects</Link>
            <Link activeClassName="active" to="/search" query={{q: results.query, type: 'thread'}}>Threads</Link>
            <Link activeClassName="active" to="/search" query={{q: results.query, type: 'commit'}}>Commits</Link>
            <Link activeClassName="active" to="/search" query={{q: results.query, type: 'user'}}>People</Link>
            <Link activeClassName="active" to="/search" query={{q: results.query, type: 'field'}}>Fields</Link>
          </Tabs>
        </SubHeader>
        <Container className={ classes.content }>
          <Row className="layout-xs-col layout-gt-xs-row">
            <Col className="flex-70">
              <div className={ classes.results }>
                <LoadingOverlay show={ results.loading } linear style={{background: 'rgba(255, 255, 255, 0.8)'}}/>
                { results.data.map((result) => (
                  <SiteSearchResult key={ result._id } result={ result } query={ results.query }/>
                )) }
              </div>
              <Pagination path={ location.pathname } query={ location.query } page={ page } noMoreResults={ noMoreResults }/>
            </Col>            
            <Col className="flex-30">

            </Col>
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}

