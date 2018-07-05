import React, { Component } from 'react'

import SubHeader from 'modules/SubHeader'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'
import SiteSearchResults from 'stemn-shared/misc/Search/SiteSearchResults'
import { Helmet } from 'react-helmet'
import classes from './Search.scss'

export default class Search extends Component {
  render() {
    const { location } = this.props

    return (
      <StandardLayout>
        <Helmet>
          <title>{ `Search: ${location.query.q}` }</title>
        </Helmet>
        <SubHeader noResponsive>
          <Tabs noline>
            <Link to="/search" className={ { active: !location.query.type } } query={ { q: location.query.q } }>Projects</Link>
            <Link activeClassName="active" to="/search" query={ { q: location.query.q, type: 'thread' } }>Threads</Link>
            <Link activeClassName="active" to="/search" query={ { q: location.query.q, type: 'user' } }>People</Link>
            <Link activeClassName="active" to="/search" query={ { q: location.query.q, type: 'field' } }>Fields</Link>
          </Tabs>
        </SubHeader>
        <Container className={ classes.content }>
          <Row className="layout-xs-col layout-gt-xs-row">
            <Col className="flex-gt-xs-70">
              <SiteSearchResults
                query={ location.query.q }
                type={ location.query.type }
                page={ parseInt(location.query.page) }
                size={ 30 }
              />
            </Col>            
            <Col className="flex-30" />
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}

//            <Link activeClassName="active" to="/search" query={ { q: location.query.q, type: 'commit' } }>Commits</Link>
