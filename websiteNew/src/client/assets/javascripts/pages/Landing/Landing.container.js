import React, { Component } from 'react'
import { connect } from 'react-redux'
import Landing from './Landing'

import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

const stateToProps = () => ({
});

const dispatchToProps = {
  storeChange,
};

@connect(stateToProps, dispatchToProps)
export default class LandingContainer extends Component {
  render() {
    this.props.storeChange('auth.background', 'test')
    return (
      <Landing {...this.props} />
    );
  }
}
