import React, { Component, PropTypes } from 'react'

import classes from './User.css'
import classNames from 'classnames'

import StandardLayout from 'layout/StandardLayout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import UserNavHeader from 'modules/UserNavHeader'
import { get } from 'lodash'

import MdLocationOn from 'react-icons/md/location-on'
import MdLink from 'react-icons/md/link'

class User extends Component {
  renderComplete() {
    const { user, children, currentUser } = this.props
    return (
      <div>
        <UserNavHeader user={ user } currentUser={ currentUser } />
        <Container>
          <Row className='layout-column layout-gt-xs-row'>
            <Col className={ classes.sidebar }>
              <UserAvatar
                name={ user.data.name }
                picture={ user.data.picture }
                shape='square'
                size={ 270 }
                className={ classes.avatar }
              />
              <div className={ classes.userPanel }>
                <h2 className={ classes.name }>{ user.data.name }</h2>
                <h3 className={ classes.blurb }>{ user.data.blurb }</h3>
                <hr />
                { get(user, 'data.profile.location[0].name') &&
                  <div className={ classes.iconInfo}>
                    <MdLocationOn size={20} />
                    { user.data.profile.location[0].name }
                  </div>
                }
                { get(user, 'data.profile.socialLinks.website') &&
                  <div className={ classes.iconInfo}>
                    <MdLink size={20} />
                    { user.data.profile.socialLinks.website }
                  </div>
                }
              </div>
            </Col>
            <Col className='flex'>
              { children }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  render() {
    const { user, children } = this.props

    const isLoaded = user && user.data

    return (
      <StandardLayout>
        <LoadingOverlay show={ !isLoaded } hideBg/>
        { isLoaded
        ? this.renderComplete()
        : null }
      </StandardLayout>
    )
  }
}

export default User
