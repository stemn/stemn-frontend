import React, { Component } from 'react'
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer'
import StandardLayout from 'layout/StandardLayout'
import UserNavHeader from 'modules/UserNavHeader'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import { Helmet } from 'react-helmet'

class Settings extends Component {
  render() {
    const { children, user, currentUser } = this.props
    return (
      <StandardLayout>
        <Helmet>
          <title>Settings</title>
        </Helmet>
        <UserNavHeader user={ user } currentUser={ currentUser } />
        <Container>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className="flex-gt-xs-30">
              <NavPillContainer>
                <NavPill to="/settings" onlyActiveOnIndex>Basic Profile</NavPill>
                <NavPill to="/settings/details">Experience and Education</NavPill>
              </NavPillContainer>
              <NavPillContainer>
                <NavPill to="/settings/account">Account</NavPill>
                <NavPill to="/settings/emails">Emails</NavPill>
                <NavPill to="/settings/billing">Billing</NavPill>
                <NavPill to="/settings/projects">Projects</NavPill>
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

export default Settings
