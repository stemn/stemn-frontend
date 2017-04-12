import React, { Component, PropTypes } from 'react';
import classes from './HeroBanner.css';
import classNames from 'classnames';
import { Container } from 'stemn-shared/misc/Layout'

export default class HeroBanner extends Component {
  render() {
    const { children } = this.props;
    return (
      <section className={ classNames(classes.banner, 'layout-column') }>
        <Container className='flex layout-column layout-align-center-center'>
          { children }
        </Container>
      </section>
    )
  }
}
