import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'
import Link from 'stemn-shared/misc/Router/Link'
import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription'

export default class OnboardingDownload extends Component {
  static propTypes = {
    completeOnboarding: PropTypes.func.isRequired, // Mark onboarding as complete
    saveSettings: PropTypes.func.isRequired,       // Save the settings object
  }
  componentDidMount() {
    // Once we get to the page, we mark the user onboarding as complete
    const { completeOnboarding, saveSettings } = this.props
    completeOnboarding()
    setTimeout(() => saveSettings())
  }
  render() {
    return (
      <PanelDescription
        title="Stemn desktop"
        description="Download Stemn desktop so you can commit files and browse revisions directly from your desktop."
      >
        <InfoPanel>
          <h3>Download</h3>
          <p>The Stemn desktop client is available for all major desktop operating systems; Windows, Linux and Mac. <Link name="downloadRoute" className="link-primary" target="_blank">Browse all versions.</Link></p>
          <DownloadButton className="primary" platform="auto" size={ 15 }>
            Download Now
          </DownloadButton>
        </InfoPanel>
        <br />
        <div className="layout-row layout-align-end">
          <Button className="lg primary" name="homeRoute">Go to Dashboard</Button>
        </div>
      </PanelDescription>
    )
  }
}
