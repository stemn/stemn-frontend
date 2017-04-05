import React, { Component } from 'react';
import { connect } from 'react-redux';

import SettingsProfile from './SettingsProfile';

const stateToProps = ({ users, auth }, { params }) => ({
  user: users[auth.user._id],
  currentUser: auth.user,
  entityModel: `users.${auth.user._id}`
});

const dispatchToProps = {

};

@connect(stateToProps, dispatchToProps)
export default class SettingsProfileContainer extends Component {
  render() {
    return (
      <SettingsProfile {...this.props} />
    );
  }
}
