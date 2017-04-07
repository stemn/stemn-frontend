import React, { Component, PropTypes } from 'react';
import classes from './Footer.css';
import classNames from 'classnames';

import { Container, Row, Col } from 'stemn-shared/misc/Layout';
import { Link } from 'react-router';


class Footer extends Component {
  render() {
    return (
      <footer className={ classNames(classes.footer) }>
        <Container className={ classNames(classes.inner, 'layout-row', 'layout-align-start-center') }>
          <div>© 2017 Stemn.</div>
          <div className="flex" />
          <Link className="link-primary" to='/'>Stemn Desktop</Link>
          <span className="text-interpunct" />
          <Link className="link-primary" to='/terms'>Terms</Link>
          <Link className="link-primary" to='/privacy'>Privacy</Link>
          <Link className="link-primary" to='/security'>Security</Link>
        </Container>
      </footer>
    )
  }
}

export default Footer;
