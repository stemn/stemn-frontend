import React, { Component } from 'react'
import classes from './User.css'
import cn from 'classnames'
import StandardLayout from 'layout/StandardLayout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import UserNavHeader from 'modules/UserNavHeader'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'
import { get } from 'lodash'
import MdLocationOn from 'react-icons/md/location-on'
import MdLink from 'react-icons/md/link'
import { userRoute } from 'route-actions'
import { Helmet } from 'react-helmet'

class User extends Component {
  renderComplete() {
    const { user, children, currentUser, location } = this.props
    const showSidebar = location.pathname === userRoute({ userId: user.data._id })
    return (
      <div>
        <Helmet>
          <title>{ user.data.name }</title>
        </Helmet>
        <UserNavHeader user={ user } currentUser={ currentUser } />
        <Container>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className={ cn(classes.sidebar, 'flex-gt-xs-30', { [classes.showSidebar]: showSidebar }) }>
              <UserAvatar
                name={ user.data.name }
                picture={ get(user, 'data.profile.picture') }
                shape="square"
                size={ 270 }
                className={ classes.avatar }
              />
              <div className={ classes.userPanel }>
                <h2 className={ classes.name }>{ user.data.name }</h2>
                <h3 className={ classes.blurb }>{ user.data.blurb }</h3>
                <hr />
                { get(user, 'data.profile.location[0].name') &&
                  <div className={ classes.iconInfo }>
                    <MdLocationOn size={ 20 } />
                    { user.data.profile.location[0].name }
                  </div>
                }
                { get(user, 'data.profile.socialLinks.website') &&
                  <div className={ classes.iconInfo }>
                    <MdLink size={ 20 } />
                    <a
                      href={ user.data.profile.socialLinks.website.startsWith('http') ? user.data.profile.socialLinks.website : `http://${user.data.profile.socialLinks.website}` }
                      target="_blank"
                    >
                      { user.data.profile.socialLinks.website }
                    </a>
                  </div>
                }
                <div className="layout-row layout-align-center">
                  <SocialButton
                    className="primary lg"
                    style={ { marginTop: '20px' } }
                    type="follow"
                    entityType="user"
                    entityId={ user.data._id }
                  />
                </div>
              </div>
            </Col>
            <Col className="flex">
              { children }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  render() {
    const {
      user,
    } = this.props

    const isLoaded = user && user.data && user.dataSize === 'lg'

    return (
      <StandardLayout>
        <LoadingOverlay show={ !isLoaded } hideBg />
        { isLoaded
          ? this.renderComplete()
          : null }
      </StandardLayout>
    )
  }
}

export default User
