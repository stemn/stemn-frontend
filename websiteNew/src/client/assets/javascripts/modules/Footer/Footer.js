import React, { Component, PropTypes } from 'react';
import classes from './Footer.css';
import classNames from 'classnames';

import { Container, Row, Col } from 'stemn-shared/misc/Layout';
import Link from 'stemn-shared/misc/Router/Link'

class Footer extends Component {
  render() {
    return (
      <footer className={ classNames(classes.footer) }>
        <Container className={ classNames(classes.inner, 'layout-row', 'layout-align-start-center') }>
          <div>© 2017 Stemn.</div>
          <div className="flex" />
          <Link className="link-primary" name="homeRoute">Stemn Desktop</Link>
          <span className="text-interpunct" />
          <Link className="link-primary" name="termsRoute">Terms</Link>
          <Link className="link-primary" name="privacyRoute">Privacy</Link>
          <Link className="link-primary" name="securityRoute">Security</Link>
        </Container>
      </footer>
    )
  }
}

export default Footer;
