import React, { Component, PropTypes } from 'react';
import { Container, Row, Col } from 'stemn-shared/misc/Layout';
import classes from './Header.css';
import classNames from 'classnames';

class Header extends Component {
  render() {
    return (
        <header className={ classNames(classes.header, 'layout-row', 'layout-align-start-center') }>
          <Container className='layout-row layout-align-start-center'>
            Stemn Website
            <div className="flex"></div>
            <a href="">Link</a>
          </Container>
        </header>
    )
  }
}

export default Header;