import React, { Component, PropTypes } from 'react'

import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import SubHeader from 'modules/SubHeader'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import MyProjectsPanel from 'stemn-shared/misc/Projects/MyProjectsPanel'
import TimelineVertical from 'stemn-shared/misc/TimelineVertical/TimelineVertical'

import classes from './Home.css'

export default class Home extends Component {
  componentWillMount() {
    this.props.getFeed()
  }
  render() {
    const { timeline } = this.props
    console.log(timeline);
    return (
      <StandardLayout>
        <SubHeader title="Dashboard" />
        <Container>
          <Row className="layout-row" style={ { marginTop: '30px' } }>
            <Col className="flex">
              <TimelineVertical items={ timeline } type="feed" group/>
            </Col>
            <Col className="flex-30">
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