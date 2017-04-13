import React, { Component, PropTypes } from 'react'

import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import SubHeader from 'modules/SubHeader'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

import classes from './Home.css'

export default class Home extends Component {
  render() {
    return (
      <StandardLayout>
        <SubHeader title="Dashboard" />
        <Container>
          <Row className="layout-row" style={ { marginTop: '30px' } }>
            <Col className="flex">
              lorem here
            </Col>
            <Col className="flex-30">
              <InfoPanel>
                <h3>Welcome to Stemn</h3>
                <p>Sign up to find projects, ideas and people that matter.</p>
                <Button className="primary">Sign Up</Button>
              </InfoPanel>
              <InfoPanel>
                <h3>Your Projects</h3>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
              </InfoPanel>
              <InfoPanel>
                <h3>People you may know</h3>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
                <div>Projects here</div>
              </InfoPanel>
            </Col>
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}
