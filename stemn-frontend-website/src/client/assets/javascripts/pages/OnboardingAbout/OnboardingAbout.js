import React, { Component } from 'react'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import Upload from 'stemn-shared/misc/Upload/Upload'
import classes from './OnboardingAbout.scss'

export default class OnboardingAbout extends Component {
  componentWillUnmount() {
    // Save user when we navigate
    this.props.saveUser({
      user: this.props.user.data,
    })
  }
  render() {
    const { user, userModel } = this.props
    return (
      <PanelDescription 
        title="About You"
        description="Add some basic account info. You'll be able to add more details later."
      >
        {/* <InfoPanel>
          <h3>Want to get a head start</h3>
          <p>Import your profile from Linkedin. This will automatically fill out your profile picture, education and experience.</p>
          <Button onClick={ confirmLinkedinImport } className="linkedin">Import from Linkedin</Button>
        </InfoPanel> */}
        <InfoPanel>
          <h3>Profile Photo</h3>
          <div className="layout-row">
            <Upload
              containerClassName={ classes.container }
              imageClassName={ classes.image }
              model={ `${userModel}.data.profile.picture` }
              value={ user.data.profile.picture }
              uploadId="UserSettingsAvatar"
            />
            <p className="flex layout-column layout-align-center-center">
              { user.data.profile.picture
                ? 'Looking good!'
                : 'Upload a profile picture' }
            </p>
          </div>
        </InfoPanel>
        <InfoPanel>
          <h3>Profile Blurb</h3>
          <p>Introduce yourself in 100 characters</p>
          <Textarea
            model={ `${userModel}.data.profile.blurb` }
            value={ user.data.profile.blurb }
            className="dr-input"
            type="text"
            placeholder="Eg: Structural Engineer @ SpaceX"
          />
        </InfoPanel>
        <br />
        <div className="layout-row layout-align-end">
          <Button className="lg primary" name="onboardingSyncRoute">Next: Sync Account</Button>
        </div>
      </PanelDescription>
    )
  }
}
