import React, { Component, PropTypes } from 'react'
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import SubHeader from 'modules/SubHeader'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

export default class Notifications extends Component {
  render() {
    const { notifications, markAsRead } = this.props
    return (
      <div>
          { notifications.map((notification) => (
              <NotificationItem
                notification={ notificaiton }
                markAsRead={ markAsRead }
              />
          )) }
      </div>
    )
  }
}
