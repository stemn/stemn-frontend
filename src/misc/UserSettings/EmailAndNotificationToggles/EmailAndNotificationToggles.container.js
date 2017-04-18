import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form'
import EmailAndNotificationToggles from './EmailAndNotificationToggles';

const stateToProps = () => ({})

const dispatchToProps = {
  change: actions.change,
}

export default connect(stateToProps, dispatchToProps)(EmailAndNotificationToggles)
