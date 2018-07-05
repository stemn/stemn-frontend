import React, { Component } from 'react'
import classes from './LandingFooter.css'
import cn from 'classnames'

import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Link from 'stemn-shared/misc/Router/Link'
import logo from './logo.png'

class Footer extends Component {
  render() {
    return (
      <footer className={ cn(classes.footer) } { ...this.props }>
        <Container className={ classes.inner }>
          <Row className="layout-row">
            <Col className="flex hide-xs">
              <img className={ classes.logo } src={ logo } />
            </Col>
            <Col className="flex hide-xs hide-sm" />
            <Col className="flex">
              <div className={ classes.title }>About</div>
              <div><Link name="landingRoute">Home</Link></div>
              <div><Link name="pricingRoute">Pricing</Link></div>
              <div><Link name="openSourceRoute">Open source</Link></div>
            </Col>
            <Col className="flex">
              <div className={ classes.title }>Product</div>
              <div><Link name="exploreRoute">Explore online</Link></div>
              <div><Link name="downloadRoute">Stemn for Desktop</Link></div>
            </Col>
            <Col className="flex">
              <div className={ classes.title }>Company</div>
              <div><Link name="termsRoute">Terms</Link></div>
              <div><Link name="privacyRoute">Privacy</Link></div>
              <div><Link name="securityRoute">Security</Link></div>
            </Col>
            <Col className="flex">
              <div className={ classes.title }>Social</div>
              <div><Link name="homeRoute">Facebook</Link></div>
              <div><Link name="homeRoute">Twitter</Link></div>
              <div><Link name="homeRoute">Linkedin</Link></div>
            </Col>
          </Row>
        </Container>
      </footer>
    )
  }
}

export default Footer
