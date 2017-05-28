import React, { Component, PropTypes } from 'react'
import classes from './Header.scss'
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
import HeaderMobileMenu from 'modules/HeaderMobileMenu'
import BetaBadge from 'modules/BetaBadge'
import MdMenu from 'react-icons/md/menu'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }
  toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
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
            <Link name="userRoute" params={ routeParams }>My profile</Link>
            <Link name="userStarsRoute" params={ routeParams }>My stars</Link>
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
      <div className='layout-row layout-align-start-center' style={ { paddingLeft: '15px' } }>
        <Link to={ loginRoute() } className='link-primary'>Sign in</Link>
      </div>
    )
  }
  render() {
    const { auth } = this.props
    const { isOpen } = this.state

    const items = [{
      route: 'exploreRoute',
      label: 'Explore',
    }]
    const itemsMobile = [{
      route: 'exploreRoute',
      label: 'Explore',
    },{
      route: 'openSourceRoute',
      label: 'Open source',
    },{
      route: 'pricingRoute',
      label: 'Pricing',
    }]
    return (
      <header className={ classNames(classes.header, 'layout-column') }>
        <HeaderMobileMenu items={ itemsMobile } isOpen={ isOpen } />
        <Container className={ classNames(classes.inner, 'layout-row layout-align-start-center') }>
          <Link to="/" className={ classes.logo }>
            <img src={ logo } alt="" />
            <BetaBadge />
          </Link>
          <SiteSearch className={ classes.search } />
          <div className={ classNames(classes.links, 'hide-xs') }>
            { items.map(item => (
              <Link key={ item } activeClassName="active" className={ classes.link } name={ item.route }>{ item.label }</Link>
            ))}
          </div>
          <div className="hide-xs flex" />
          { auth.user._id
          ? this.isLoggedIn()
          : this.isLoggedOut() }
          <SimpleIconButton
            className={ classNames('hide-gt-xs', classes.menuButton) }
            onClick={ this.toggleOpen }
          >
            <MdMenu size={ 25 } />
          </SimpleIconButton>
        </Container>
      </header>
    )
  }
}
