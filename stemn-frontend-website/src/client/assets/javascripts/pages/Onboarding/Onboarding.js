import React, { Component } from 'react'
import { ArrowTabs, ArrowTab } from 'stemn-shared/misc/Tabs/ArrowTabs/ArrowTabs.jsx'
import { Container } from 'stemn-shared/misc/Layout'
import { Helmet } from 'react-helmet'
import classes from './Onboarding.scss'
import cn from 'classnames'

export default class Onboarding extends Component {
  render() {
    const { children, user } = this.props

    return (
      <div>
        <Helmet>
          <title>Welcome to Stemn</title>
        </Helmet>
        <div className={ cn(classes.header, 'layout-row layout-align-start-center') }>
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
            <div className="text-title-4">Nice! You'll have Stemn up and running very soon</div>
          </div>
          { user && user.dataSize === 'lg' ? children : null }
        </Container>
      </div>
    )
  }
}
