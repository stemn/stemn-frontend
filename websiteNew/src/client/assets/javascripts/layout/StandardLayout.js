import React, { Component, PropTypes } from 'react';
import Header from '../modules/Header'
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
    const { children, contained, style, ...otherProps } = this.props;
    return (
      <div { ...otherProps }>
        <Header />
        { this.renderInner(children, contained, style) }
      </div>

    )
  }
}

export default StandardLayout;