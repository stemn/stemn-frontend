import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';

import Notifications from './Notifications';

const stateToProps = (state, { params }) => ({
  currentUser: state.auth.user,
});

const dispatchToProps = {
};

const fetchConfigs = [];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class NotificationsContainer extends Component {
  render() {
    return <Notifications {...this.props} />
  }
}
