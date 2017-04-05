import React, { Component } from 'react';
import { connect } from 'react-redux';
import LikeButton from './LikeButton';

import { like, unlike } from '../Likes.actions';

const stateToProps = ({ likes }, { projectId }) => ({
  active: likes[projectId]
});

const dispatchToProps = {
  like,
  unlike
};

export default connect(stateToProps, dispatchToProps)(LikeButton);
