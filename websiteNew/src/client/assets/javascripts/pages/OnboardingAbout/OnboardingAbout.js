import React, { Component, PropTypes } from 'react'

import { Container, Col, Row } from 'stemn-shared/misc/Layout'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'


import classes from './OnboardingAbout.scss'
import classNames from 'classnames'

export default class OnboardingAbout extends Component {
  render() {
    const { user, userModel, confirmLinkedinImport } = this.props
    return (
      <div>
        <div className="text-title-2">About You</div>
        <br/>
        <Row className="layout-row">
          <Col className="flex-40">
            <div className="text-title-5">
              Add some basic account info. You'll be able to add more details later.
            </div>
          </Col>
          <Col className="flex">
            <InfoPanel>
              <h3>Want to get a head start</h3>
              <p>Import your profile from Linkedin. This will automatically fill out your profile picture, education and experience.</p>
              <Button onClick={ confirmLinkedinImport } className="linkedin">Import from Linkedin</Button>
            </InfoPanel>
            <InfoPanel>
              <h3>Profile Photo</h3>
              <p>Import your profile from Linkedin. This will automatically fill out your profile picture, education and experience.</p>
              <Button className="linkedin">Import from Linkedin</Button>
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
          </Col>
        </Row>
        <br />
        <div className="layout-row layout-align-end">
          <Button className="lg primary" name="onboardingSyncRoute">Next: Sync Account</Button>
        </div>
      </div>
    )
  }
}
