import React, { Component, PropTypes } from 'react'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import SubHeader from 'modules/SubHeader'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import MyProjectsPanel from 'stemn-shared/misc/Projects/MyProjectsPanel'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import classes from './Home.css'

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
    const { timeline, push, filterValue } = this.props


    return (
      <StandardLayout>
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
              <div className={ classes.panel }>
                <TimelineVertical
                  items={ timeline }
                  type="feed"
                  group
                />
              </div>
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
