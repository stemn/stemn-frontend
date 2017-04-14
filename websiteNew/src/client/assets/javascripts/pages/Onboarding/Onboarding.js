import React, { Component, PropTypes } from 'react'

import { ArrowTabs, ArrowTab } from 'stemn-shared/misc/Tabs/ArrowTabs/ArrowTabs.jsx';
import { Container } from 'stemn-shared/misc/Layout'

import classes from './Onboarding.scss'
import classNames from 'classnames'

export default class Onboarding extends Component {
  render() {
    const { children, user } = this.props

    return (
      <div>
        <div className={ classNames(classes.header, 'layout-row layout-align-start-center') }>
          <Container>
            <ArrowTabs className="layout-row flex">
              <ArrowTab activeClassName="active" arrow name="onboardingAboutRoute" onlyActiveOnIndex>
                About You
              </ArrowTab>
              <ArrowTab activeClassName="active" arrow name="onboardingSyncRoute">
                Sync Account
              </ArrowTab>
              <ArrowTab activeClassName="active" name="onboardingDownloadRoute">
                Download
              </ArrowTab>
            </ArrowTabs>
          </Container>
        </div>
        <Container className={ classes.content }>
          <div className={ classes.title }>
            <div className="text-title-2">Setup Sync</div>
            <div className="text-title-4">Nice! You'll have STEMN up and running very soon</div>
          </div>
          { user && user.dataSize === 'lg' ? children : null }
        </Container>
      </div>
    )
  }
}
