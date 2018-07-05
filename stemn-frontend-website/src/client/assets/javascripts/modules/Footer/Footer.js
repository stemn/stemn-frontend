import React, { Component } from 'react'
import classes from './Footer.css'
import cn from 'classnames'

import { Container } from 'stemn-shared/misc/Layout'
import Link from 'stemn-shared/misc/Router/Link'
import logo from '../LandingFooter/logo.png'

class Footer extends Component {
  render() {
    return (
      <footer className={ cn(classes.footer) }>
        <Container className={ cn(classes.inner, 'layout-row', 'layout-align-start-center') }>
          <img src={ logo } className={ classes.logo } />

          <div className="flex" />
          <Link activeClassName="active" name="landingRoute">Landing</Link>
          <span className="text-interpunct" />
          <Link activeClassName="active" name="termsRoute">Terms</Link>
          <Link activeClassName="active" name="privacyRoute">Privacy</Link>
          <Link activeClassName="active" name="securityRoute">Security</Link>
        </Container>
      </footer>
    )
  }
}

export default Footer
