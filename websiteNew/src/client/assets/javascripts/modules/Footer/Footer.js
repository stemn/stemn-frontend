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
          <a className="link-primary">Stemn Desktop</a>
          <span className="text-interpunct"/>
          <a className="link-primary">Terms</a>
          <a className="link-primary">Privacy</a>
          <a className="link-primary">About</a>
        </Container>
      </footer>
    )
  }
}

export default Footer;
