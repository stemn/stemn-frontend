import React, { Component } from 'react'
import { connect } from 'react-redux'
import LikeButton from './LikeButton'

import { like, unlike, checkIsLiked } from '../Likes.actions'

const stateToProps = ({ likes }, { entityId }) => ({
  active: likes[entityId]
})

const dispatchToProps = {
  like,
  unlike,
  checkIsLiked
}

export default connect(stateToProps, dispatchToProps)(LikeButton)
