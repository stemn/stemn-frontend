import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './Home';

const stateToProps = ({ auth }) => ({
  auth
});

const dispatchToProps = {
};

@connect(stateToProps, dispatchToProps)
export default class HomeContainer extends Component {
  render() {
    return (
      <Home {...this.props} />
    );
  }
}