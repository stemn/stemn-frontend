import React, { Component, PropTypes } from 'react';
import classes from './LandingHeader.css';
import classNames from 'classnames';

import { loginRoute } from 'route-actions';

import { Container, Row, Col } from 'stemn-shared/misc/Layout';
import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import Popover from 'stemn-shared/misc/Popover';
import Link from 'stemn-shared/misc/Router/Link'
import logo from 'images/logo80x80none.png';
import MdAdd from 'react-icons/md/add';
import MdNotifications from 'react-icons/md/notifications';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton';
import SiteSearch from 'modules/SiteSearch';

export default class LandingHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      atTop: true
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll = (event) => {
    const { atTop } = this.state
    if (atTop && document.body.scrollTop !== 0) {
      this.setState({ atTop: false })
    } else if (!atTop && document.body.scrollTop === 0) {
      this.setState({ atTop: true })
    }
  }
  isLoggedIn() {
    const { auth, logout, newProject } = this.props;
    const routeParams = { userId: auth.user._id }

    return (
      <Link to='/' className={ classNames('layout-row layout-align-start-center', classes.specialLink )}>
        <div>Dashboard</div>
        <Avatar
          shape='square'
          size={ 30 }
          name={ auth.user.name }
          picture={ auth.user.picture }
        />
      </Link>
    )

  }
  isLoggedOut() {
    return (
      <div className='layout-row layout-align-start-center'>
        <Link to={ loginRoute() } className={ classNames('layout-row layout-align-start-center', classes.specialLink ) }>
          <div>Sign in</div>
        </Link>
      </div>
    )

  }
  render() {
    const { atTop } = this.state
    const { auth, logout, newProject } = this.props
    const allClasses = classNames(classes.header, 'layout-row', 'layout-align-start-center', {[classes.headerFilled] : !atTop})
    return (
      <header className={ allClasses } onScroll={ this.onScroll }>
        <Container className='layout-row layout-align-start-center'>
          <Link to='/landing' className={ classes.logo }>
            <img src={logo} alt=""/>
          </Link>
          <Link activeClassName="active" className={ classes.link } name="featuresRoute">Features</Link>
          <Link activeClassName="active" className={ classes.link } name="openSourceRoute">Open source</Link>
          <Link activeClassName="active" className={ classes.link } name="pricingRoute">Pricing</Link>
          <Link activeClassName="active" className={ classes.link } name="downloadRoute">Download</Link>
          <div className="flex"></div>
          { auth.user._id
          ? this.isLoggedIn()
          : this.isLoggedOut() }
        </Container>
      </header>
    )
  }
}
