import React, { Component, PropTypes } from 'react'

import { Container, Col, Row } from 'stemn-shared/misc/Layout'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'
import Link from 'stemn-shared/misc/Router/Link'

import classNames from 'classnames'

export default class OnboardingDownload extends Component {
  render() {
    return (
      <div>
        <div className="text-title-2">Stemn desktop</div>
        <br/>
        <Row className="layout-row">
          <Col className="flex-40">
            <div className="text-title-5">
              Download Stemn desktop so you can commit files and browse revisions directly from your desktop.
            </div>
          </Col>
          <Col className="flex">
            <InfoPanel>
              <h3>Download</h3>
              <p>The Stemn desktop client is available for all major desktop operating systems, Windows, Linux and Mac. <Link name="downloadRoute" className="link-primary" target="_blank">Browse all version.</Link></p>
              <DownloadButton className="primary" platform="auto" size={ 15 }>
                Download Now
              </DownloadButton>
            </InfoPanel>
          </Col>
        </Row>
        <br />
        <div className="layout-row layout-align-end">
          <Button className="lg primary">Go to Dashboard</Button>
        </div>
      </div>
    )
  }
}
