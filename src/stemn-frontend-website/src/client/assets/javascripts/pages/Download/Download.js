import React, { Component } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'
import bytes from 'stemn-shared/utils/filters/bytes.js'
import { Container } from 'stemn-shared/misc/Layout'
import { Helmet } from 'react-helmet'

import moment from 'moment'

import classes from './Download.scss'

export default class Download extends Component {
  render() {
    const { latest } = this.props

    const getPlatformSection = platform => (
      <div className={ classes.platform }>
        <h3 className="text-title-4">Stemn Desktop for <span style={ { textTransform: 'capitalize' } }>{ platform }</span></h3>
        <div className="text-title-5" style={ { marginBottom: '15px' } }>
          <div>{ latest.version } - released { moment(latest[platform].updated_at).calendar() }</div>
          <div>Size - { bytes(latest[platform].size) }</div>
          <a className="link-primary" href={ `https://github.com/stemn/Stemn-Desktop/releases/tag/${latest.version}` } target="_blank">Release Notes</a>
        </div>
        <DownloadButton className="secondary lg" platform={ platform }>
          Download
        </DownloadButton>
      </div>
    )
    return (
      <LandingLayout>
        <Helmet>
          <title>Download Stemn Desktop</title>
        </Helmet>
        <HeroBanner>
          <h1>Download Stemn Desktop</h1>
          <h3>Collaboration tools for Engineers</h3>
        </HeroBanner>
        { latest && latest.version
          ? <Container>
            { getPlatformSection('windows') }
            { getPlatformSection('mac') }
            { getPlatformSection('linux') }
          </Container>
          : null }
      </LandingLayout>
    )
  }
}
