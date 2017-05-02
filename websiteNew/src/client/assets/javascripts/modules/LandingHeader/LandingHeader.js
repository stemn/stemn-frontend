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
import MdMenu from 'react-icons/md/menu'

export default class LandingHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      atTop: true,
      isOpen: false,
    }
  }
  toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
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
    if (window.location.pathname !== '/login') {
      return (
        <div className='layout-row layout-align-start-center'>
          <Link to={ loginRoute() } className={ classNames('layout-row layout-align-start-center', classes.specialLink ) }>
            <div>Sign in</div>
          </Link>
        </div>
      )
    }
    else {
      return null
    }
  }
  render() {
    const { atTop, isOpen } = this.state
    const { auth, logout, newProject } = this.props
    const allClasses = classNames(
      classes.header,
      'layout-xs-column layout-align-xs-center layout-gt-xs-row layout-gt-xs-align-start-center',
      {[classes.headerFilled] : !atTop || isOpen}
    )

    const items = [{
      route: 'flowRoute',
      label: 'Workflow',
    },{
      route: 'openSourceRoute',
      label: 'Open source',
    },{
      route: 'pricingRoute',
      label: 'Pricing',
    },{
      route: 'downloadRoute',
      label: 'Download',
    }]

    const linkHeight = 33
    const mobileLinkStyle = {
      height: `${linkHeight}px`
    }
    const mobileLinksStyle = isOpen
      ? {
        height: linkHeight * items.length
      }
      : {}

    return (
      <header className={ allClasses }>
        <Container className="hide-xs layout-row layout-align-start-center">
          <Link to='/landing' className={ classes.logo }>
            <img src={logo} alt=""/>
          </Link>
          { items.map(item => (
            <Link activeClassName="active" className={ classes.link } name={ item.route }>{ item.label }</Link>
          ))}
          <div className="flex" />
          { auth.user._id
          ? this.isLoggedIn()
          : this.isLoggedOut() }
        </Container>
        <div className={ classNames(classes.mobileLinks, 'hide-gt-xs') } style={ mobileLinksStyle }>
          { items.map(item => (
            <Link
              activeClassName="active"
              className={ classNames(classes.mobileLink, 'layout-row layout-align-start-center') }
              style={ mobileLinkStyle }
              name={ item.route }
            >
              { item.label }
            </Link>
          ))}
        </div>
        <Container className="hide-gt-xs layout-row layout-align-start-center">
          <Link to='/landing' className={ classes.logo }>
            <img src={logo} alt=""/>
          </Link>
          <div className="flex" />
          { auth.user._id
          ? this.isLoggedIn()
          : this.isLoggedOut() }

          <MdMenu className={ classes.menuButton } onClick={ this.toggleOpen } size={ 25 } />
        </Container>
      </header>
    )
  }
}
