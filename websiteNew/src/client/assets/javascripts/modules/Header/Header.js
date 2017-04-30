import React, { Component, PropTypes } from 'react'
import classes from './Header.css'
import classNames from 'classnames'
import { loginRoute } from 'route-actions'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Popover from 'stemn-shared/misc/Popover'
import Link from 'stemn-shared/misc/Router/Link'
import logo from 'images/logo80x80.png'
import MdAdd from 'react-icons/md/add'
import MdNotifications from 'react-icons/md/notifications'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import SiteSearch from 'stemn-shared/misc/Search/SiteSearch'

class Header extends Component {
  isLoggedIn() {
    const { auth, logout, newProject, numNotifications } = this.props
    const routeParams = { userId: auth.user._id }
    
    return (
      <div className="layout-row layout-align-start-center">
        <SimpleIconButton
          title="Create new project"
          onClick={ newProject }
        >
          <MdAdd size={ 25 } />
        </SimpleIconButton>
        <SimpleIconButton
          title="Notifications"
          to="/notifications"
          style={ { marginRight: '10px' } }
          className="rel-box"
        >
          <MdNotifications size={ 22 } />
          { numNotifications > 0 && <div className={ classes.badge }>{ numNotifications }</div> }
        </SimpleIconButton>
        <Popover
          offset={ 13 }
          tipSize={ 1 }
          preferPlace="below"
          trigger="click"
        >
          <a>
            <Avatar
              shape="square"
              size={ 30 }
              name={ auth.user.name }
              picture={ auth.user.picture }
            />
          </a>
          <div className="PopoverMenu">
            <Link name="userRoute" params={ routeParams }>Your profile</Link>
            <Link name="userStarsRoute" params={ routeParams }>Your stars</Link>
            <Link name="settingsRoute">Settings</Link>
            <div className="divider" />
            <a onClick={ logout }>Logout</a>
          </div>
        </Popover>
      </div>
    )

  }
  isLoggedOut() {
    return (
      <div className='layout-row layout-align-start-center'>
        <Link to={ loginRoute() } className='link-primary'>Sign in</Link>
      </div>
    )
  }
  render() {
    const { auth } = this.props
    return (
      <header className={ classNames(classes.header, 'layout-row', 'layout-align-start-center') }>
        <Container className="layout-row layout-align-start-center">
          <Link to="/" className={ classes.logo }>
            <img src={ logo } alt="" />
          </Link>
          <SiteSearch />
          <div className="flex" />
          { auth.user._id
          ? this.isLoggedIn()
          : this.isLoggedOut() }
        </Container>
      </header>
    )
  }
}

export default Header
