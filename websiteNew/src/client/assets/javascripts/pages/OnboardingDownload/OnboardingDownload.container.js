import React, { Component } from 'react'
import { connect } from 'react-redux'
import OnboardingDownload from './OnboardingDownload'

const stateToProps = () => ({
})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class OnboardingDownloadContainer extends Component {
  render() {
    return (
      <OnboardingDownload {...this.props} />
    );
  }
}
