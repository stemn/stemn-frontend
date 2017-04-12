import React, { Component, PropTypes } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import bytes from 'stemn-shared/utils/filters/bytes.js'
import { Container } from 'stemn-shared/misc/Layout'

import classes from './Download.scss'

export default class Download extends Component {
  componentDidMount() {
    this.props.getLatest()
  }
  render() {
    const { latest } = this.props;

    const getPlatformSection = (platform) => (
      <div className={ classes.platform }>
        <h3 className="text-title-4">Stemn Desktop for { platform }</h3>
        <div className="text-title-5" style={{ marginBottom: '15px' }}>
          <div>{ latest.version } - {latest[platform].updated_at}</div>
          <div>Size - { bytes(latest[platform].size) }</div>
          <a className="link-primary">Release Notes</a>
        </div>
        <Button className="primary" download href={ latest[platform].browser_download_url}>Download for { platform }</Button>
      </div>
    )
    if (latest && latest.version) {
      return (

        <LandingLayout>
          <HeroBanner>
            <h1>Download Stemn Desktop</h1>
            <h3>Collaboration tools for Engineers</h3>
          </HeroBanner>
          <Container>
            { getPlatformSection('windows') }
            { getPlatformSection('mac') }
            { getPlatformSection('linux') }
          </Container>
        </LandingLayout>
      )
    } else {
      return null
    }
  }
}
