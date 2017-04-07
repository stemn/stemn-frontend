import React, { Component, PropTypes } from 'react'
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import SubHeader from 'modules/SubHeader'

export default class Notifications extends Component {
  render() {
    const { children, user, currentUser } = this.props
    return (
      <StandardLayout>
        <SubHeader title='Notifications'></SubHeader>
        <Container>
          <Row className="layout-row">
            <Col style={ { width: '250px' } }>
              <NavPillContainer>
                <NavPill to='/settings' onlyActiveOnIndex={true}>Unread</NavPill>
                <NavPill to='/settings/account'>All Notifications</NavPill>
              </NavPillContainer>
            </Col>
            <Col className="flex">
              { children }
            </Col>
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}
