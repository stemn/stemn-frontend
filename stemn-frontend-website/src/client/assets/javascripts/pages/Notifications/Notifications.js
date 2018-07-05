import React, { Component } from 'react'
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import SubHeader from 'modules/SubHeader'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Helmet } from 'react-helmet'

export default class Notifications extends Component {
  render() {
    const { children, notifications, markAsRead } = this.props

    const markAllRead = () => {
      const unreadNotifications = notifications && notifications.data
        ? notifications.data.filter(notification => !notification.read)
        : []

      unreadNotifications.forEach(notification => markAsRead(notification._id))
    }

    return (
      <StandardLayout>
        <Helmet>
          <title>Notifications</title>
        </Helmet>
        <SubHeader title="Notifications" noResponsive>
          <div className="layout-column layout-align-center">
            <Button className="primary" onClick={ markAllRead }>Mark as read</Button>
          </div>
        </SubHeader>
        <Container style={ { marginTop: '30px' } }>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className="flex-gt-xs-30">
              <NavPillContainer>
                <NavPill to="/notifications" onlyActiveOnIndex>Unread</NavPill>
                <NavPill to="/notifications/all">All Notifications</NavPill>
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
