import React, { Component, PropTypes } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import bytes from 'stemn-shared/utils/filters/bytes.js'
import { Container } from 'stemn-shared/misc/Layout'

import moment from 'moment';

import classes from './Download.scss'

import WindowsIcon from 'stemn-shared/assets/icons/os/windows'
import LinuxIcon from 'stemn-shared/assets/icons/os/linux'
import AppleIcon from 'stemn-shared/assets/icons/os/apple'

const getIcon = (platform) => {
  if (platform === 'mac') {
    return <AppleIcon className={ classes.icon } />
  } else if (platform === 'linux') {
    return <LinuxIcon className={ classes.icon } />
  } else {
    return <WindowsIcon className={ classes.icon } />
  }
}

export default class Download extends Component {
  componentDidMount() {
    this.props.getLatest()
  }
  render() {
    const { latest } = this.props;

    const getPlatformSection = (platform) => (
      <div className={ classes.platform }>
        <h3 className="text-title-4">Stemn Desktop for <span style={{textTransform: 'capitalize'}}>{ platform }</span></h3>
        <div className="text-title-5" style={{ marginBottom: '15px' }}>
          <div>{ latest.version } - released { moment(latest[platform].updated_at).calendar() }</div>
          <div>Size - { bytes(latest[platform].size) }</div>
          <a className="link-primary">Release Notes</a>
        </div>
        <Button className="secondary lg" download href={ latest[platform].browser_download_url}>
          { getIcon(platform) } Download
        </Button>
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
