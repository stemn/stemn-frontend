import React, { Component } from 'react'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import UserCloudProviderSettings from 'stemn-shared/misc/UserSettings/UserCloudProviderSettings'
import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription'

export default class OnboardingAbout extends Component {
  render() {
    const { user, authenticate, unlink } = this.props
    return (
      <PanelDescription
        title="Connect Sync"
        description="Connect your Dropbox or Google Drive. This allows your STEMN projects to Sync directly to your computer."
      >
        <InfoPanel>
          <UserCloudProviderSettings user={user} authenticate={authenticate} unlink={unlink} />
        </InfoPanel>
        <br />
        <div className="layout-row layout-align-end">
          <Button className="lg primary" name="onboardingDownloadRoute">
            Next: Download
          </Button>
        </div>
      </PanelDescription>
    )
  }
}
