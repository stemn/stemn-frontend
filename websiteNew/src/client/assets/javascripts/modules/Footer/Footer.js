import React, { Component, PropTypes } from 'react'
import classes from './Footer.css'
import classNames from 'classnames'

import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Link from 'stemn-shared/misc/Router/Link'
import logo from '../LandingFooter/logo.png'

class Footer extends Component {
  render() {
    return (
      <footer className={ classNames(classes.footer) }>
        <Container className={ classNames(classes.inner, 'layout-row', 'layout-align-start-center') }>
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
