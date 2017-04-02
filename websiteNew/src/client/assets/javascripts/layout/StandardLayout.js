import React, { Component, PropTypes } from 'react';
import Header from 'modules/Header';
import Footer from 'modules/Footer';

import classNames from 'classnames';
import { Container } from 'stemn-shared/misc/Layout';

class StandardLayout extends Component {
  renderInner(children, contained, style) {
    if (contained) {
      return (
        <Container style={ style }>
          { children }
        </Container>
      )
      
    } else {
      return this.props.children
    }
  }
  render() {
    const { children, contained, className, style, ...otherProps } = this.props;
    const standardClasses = 'layout-column flex'
    return (
      <div className={ classNames(standardClasses, className) } { ...otherProps }>
        <Header />
        <div className="flex">
           { this.renderInner(children, contained, style) }
        </div>
        <Footer />
      </div>

    )
  }
}

export default StandardLayout;
