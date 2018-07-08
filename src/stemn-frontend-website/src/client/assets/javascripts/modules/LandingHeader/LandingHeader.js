import React, { Component } from 'react'
import classes from './LandingHeader.scss'
import cn from 'classnames'
import { loginRoute } from 'route-actions'
import { Container } from 'stemn-shared/misc/Layout'
import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'
import logo from 'images/logo80x80none.png'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import HeaderMobileMenu from 'modules/HeaderMobileMenu'
import MdMenu from 'react-icons/md/menu'
import BetaBadge from 'modules/BetaBadge'

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
    this.handleScroll()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const { atTop } = this.state
    if (atTop && scrollTop !== 0) {
      this.setState({ atTop: false })
    } else if (!atTop && scrollTop === 0) {
      this.setState({ atTop: true })
    }
  }
  isLoggedIn() {
    const {
      auth,
    } = this.props
    const routeParams = { userId: auth.user._id }

    return (
      <Link to="/" className={ cn('layout-row layout-align-start-center', classes.specialLink) }>
        <div>Dashboard</div>
        <Avatar
          shape="square"
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
        <div className="layout-row layout-align-start-center">
          <Link to={ loginRoute() } className={ cn('layout-row layout-align-start-center', classes.specialLink) }>
            <div>Sign in</div>
          </Link>
        </div>
      )
    }
    
    return null
  }
  render() {
    const { atTop, isOpen } = this.state
    const {
      auth,
    } = this.props
    const allClasses = cn(
      classes.header,
      'layout-xs-column layout-align-xs-center layout-gt-xs-row layout-gt-xs-align-start-center',
      { [classes.headerFilled]: !atTop || isOpen },
    )

    //      route: 'flowRoute',
    //      label: 'Workflow',
    const items = [{
      route: 'exploreRoute',
      label: 'Explore',
    }, {
      route: 'openSourceRoute',
      label: 'Open source',
    }, {
      route: 'pricingRoute',
      label: 'Pricing',
    }, {
      route: 'downloadRoute',
      label: 'Download',
    }]

    return (
      <header className={ allClasses }>
        <Container className={ cn(classes.inner, 'hide-xs layout-row layout-align-start-center') }>
          <Link to="/landing" className={ classes.logo }>
            <img src={ logo } alt="" />
            <BetaBadge />
          </Link>
          { items.map(item => (
            <Link key={ item.label } activeClassName="active" className={ classes.link } name={ item.route }>{ item.label }</Link>
          ))}
          <div className="flex" />
          { auth.user._id && auth.authToken
            ? this.isLoggedIn()
            : this.isLoggedOut() }
        </Container>
        <HeaderMobileMenu items={ items } isOpen={ isOpen } />
        <Container className={ cn(classes.inner, 'hide-gt-xs layout-row layout-align-start-center') }>
          <Link to="/landing" className={ classes.logo }>
            <img src={ logo } alt="" />
          </Link>
          <div className="flex" />
          { auth.user._id && auth.authToken
            ? this.isLoggedIn()
            : this.isLoggedOut() }
          <SimpleIconButton
            className={ cn('hide-gt-xs', classes.menuButton) }
            onClick={ this.toggleOpen }
          >
            <MdMenu size={ 25 } />
          </SimpleIconButton>
        </Container>
      </header>
    )
  }
}
