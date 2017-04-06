import React, { Component, PropTypes } from 'react'

import classes from './User.css'
import classNames from 'classnames'

import StandardLayout from 'layout/StandardLayout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import UserNavHeader from 'modules/UserNavHeader'

import MdLocationOn from 'react-icons/md/location-on';
import MdLink from 'react-icons/md/link';

class User extends Component {
  renderComplete() {
    const { user, children, currentUser } = this.props

    const isCurrentUser = user.data._id === currentUser._id

    const baseUrl = `/users/${user.data._id}`
    return (
      <div>
        <UserNavHeader user={ user } currentUser={ currentUser }/>
        <Container>
          <Row className='layout-column layout-gt-sm-row'>
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
                <div className={ classes.iconInfo}>
                  <MdLocationOn size={20} />
                  Sydney, Australia
                </div>               
                <div className={ classes.iconInfo}>
                  <MdLink size={20} />
                  davidrevay.com
                </div>
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
  renderPending() {
    return (
      <div>Loading</div>
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
        : this.renderPending() }
      </StandardLayout>
    )
  }
}

export default User
