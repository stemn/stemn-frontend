import React, { Component } from 'react'
import { connect } from 'react-redux'
import SocialButton from './SocialButton'
import { add, remove, checkStatus } from '../Social.actions'

const stateToProps = ({ social }, { entityId, type }) => ({
  status: social[type][entityId]
})

const dispatchToProps = {
  add,
  remove,
  checkStatus,
}

export default connect(stateToProps, dispatchToProps)(SocialButton)
