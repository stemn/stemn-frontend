import React, { Component, PropTypes } from 'react';
import classes from './LandingHeader.css';
import classNames from 'classnames';

import { loginRoute } from 'route-actions';

import { Container, Row, Col } from 'stemn-shared/misc/Layout';
import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import Popover from 'stemn-shared/misc/Popover';
import Link from 'stemn-shared/misc/Router/Link'
import logo from 'images/logo80x80.png';
import MdAdd from 'react-icons/md/add';
import MdNotifications from 'react-icons/md/notifications';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton';
import SiteSearch from 'modules/SiteSearch';

export default class LandingHeader extends Component {
  isLoggedIn() {
    const { auth, logout, newProject } = this.props;
    const routeParams = { userId: auth.user._id }

    return (
      <Link to='/' className={ classNames('layout-row layout-align-start-center', classes.dashboardLink )}>
        <Avatar
          shape='square'
          size={ 30 }
          name={ auth.user.name }
          picture={ auth.user.picture }
        />
        <div>Dashboard</div>
      </Link>
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
    const { auth, logout, newProject } = this.props;
    return (
      <header className={ classNames(classes.header, 'layout-row', 'layout-align-start-center') }>
        <Container className='layout-row layout-align-start-center'>
          <Link to='/' className={ classes.logo }>
            <img src={logo} alt=""/>
          </Link>
          <Link activeClassName="active" className={ classes.link } to='/'>Features</Link>
          <Link activeClassName="active" className={ classes.link } to='/'>Pricing</Link>
          <Link activeClassName="active" className={ classes.link } to='/download'>Download</Link>
          <Link activeClassName="active" className={ classes.link } to='/'>Explore</Link>
          <div className="flex"></div>
          { auth.user._id
          ? this.isLoggedIn()
          : this.isLoggedOut() }
        </Container>
      </header>
    )
  }
}
