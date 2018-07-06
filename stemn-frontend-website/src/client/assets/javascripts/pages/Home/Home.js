import React, { Component } from 'react'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import SubHeader from 'modules/SubHeader'
import Panel from 'stemn-shared/misc/Panels/Panel'
import MyProjectsPanel from 'stemn-shared/misc/Projects/MyProjectsPanel'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import Pagination from 'stemn-shared/misc/Pagination'
import Link from 'stemn-shared/misc/Router/Link'
import { Helmet } from 'react-helmet'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'


export default class Home extends Component {
  filterOptions = [{
    value: 'all',
    name: 'Feed: All',
    onClick: () => this.pushFilter('all'),
  }, {
    value: 'own-projects',
    name: 'Feed: My Projects',
    onClick: () => this.pushFilter('own-projects'),
  }, {
    value: 'followed-projects',
    name: 'Feed: Followed Projects',
    onClick: () => this.pushFilter('followed-projects'),
  }, {
    value: 'followed-users',
    name: 'Feed: Followed Users',
    onClick: () => this.pushFilter('followed-users'),
  }]
  pushFilter = filter => this.props.push({
    pathname: window.location.pathname,
    query: {
      filter,
    },
  })
  render() {
    const {
      timeline,
      filterValue,
      location,
      page,
      size,
    } = this.props

    const hasResults = timeline && timeline.data && timeline.data.length > 0
    const hasNoResults = timeline && timeline.data && timeline.data.length === 0
    const noMoreResults = timeline && timeline.data && timeline.data.length < size

    return (
      <StandardLayout>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <SubHeader title="Dashboard" noResponsive>
          <div className="layout-column layout-align-center-center">
            <PopoverDropdown
              value={ filterValue }
              options={ this.filterOptions }
            />
          </div>
        </SubHeader>
        <Container>
          <Row className="layout-xs-column layout-gt-xs-row" style={ { marginTop: '30px' } }>
            <Col className="flex flex-order-xs-1">
              <Panel>
                <LoadingOverlay show={ timeline.loading } linear hideBg noOverlay />
                { hasResults &&
                  <TimelineVertical
                    items={ timeline.data }
                    type="feed"
                    group
                  />
                }
                { hasNoResults &&
                  <div className="text-title-5">Your feed is empty. Follow some <Link name="exploreRoute" className="link-primary">projects or users.</Link></div>
                }
              </Panel>
              { hasResults &&
                <Pagination
                  path={ location.pathname }
                  page={ page }
                  noMoreResults={ noMoreResults }
                />
              }
            </Col>
            <Col className="flex-gt-xs-30 flex-order-xs-0">
              <MyProjectsPanel />
            </Col>
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}


//              <InfoPanel>
//                <h3>Welcome to Stemn</h3>
//                <p>Sign up to find projects, ideas and people that matter.</p>
//                <Button className="primary">Sign Up</Button>
//              </InfoPanel>
