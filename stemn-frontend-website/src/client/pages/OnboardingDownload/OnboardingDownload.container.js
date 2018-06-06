import React, { Component } from 'react'
import { connect } from 'react-redux'
import OnboardingDownload from './OnboardingDownload'
import { saveSettings, completeOnboarding } from 'stemn-shared/misc/UserSettings/UserSettings.actions'

const stateToProps = () => ({
})

const dispatchToProps = {
  saveSettings,
  completeOnboarding,
}

@connect(stateToProps, dispatchToProps)
export default class OnboardingDownloadContainer extends Component {
  render() {
    return (
      <OnboardingDownload { ...this.props } />
    )
  }
}
