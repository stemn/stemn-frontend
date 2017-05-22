import React, { Component, PropTypes } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import screenshot from './screenshot.jpg'
import deviceMockups from './deviceMockups.jpg'
import historyCombined from './historyCombined.jpg'
import classes from './Landing.scss'
import classNames from 'classnames'
import FileIcon from 'stemn-shared/misc/FileList/components/FileIcon'
import { Helmet } from "react-helmet";
import isMobile from 'stemn-shared/utils/agent/isMobile'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import MdLock from 'react-icons/md/input'

export default class Landing extends Component {
  render() {
    const { latest } = this.props
    const secionClasses = classNames(classes.section, 'layout-xs-column layout-gt-xs-row layout-align-gt-xs-start-center lg')
    return (
      <LandingLayout>
        <Helmet>
          <title>Stemn: Seamless Version Control and Task Tracking</title>
        </Helmet>
        <HeroBanner className={ classes.banner }>
          <h1>Seamless Version Control and Task Tracking</h1>
          <h3>A unified workflow for modern engineers</h3>
          { isMobile()
          ? <Button className={ classes.downloadButton + ' secondary lg'} name="loginRoute">
              <MdLock size={ 20 } style={ { marginRight: '10px' } } />
              Get Started
            </Button>
          : <DownloadButton className={ classes.downloadButton + ' secondary lg'} platform="auto" >
              Download Now
            </DownloadButton>
          }
          <div className={ classes.screenshot }>
           <img src={screenshot}/>
          </div>
        </HeroBanner>
        <Container>
          <Row className={ secionClasses }>
            <Col className="flex-gt-xs-50 lg">
              <div className={ classes.timeline }>
                <img src={ historyCombined } />
              </div>
            </Col>
            <Col className="flex-gt-xs-50 lg">
              <h4 className="text-title-2">Infinite version history</h4>
              <p className="text-title-4">All your changes are automatically synced as you work.</p>
              <p className="text-title-4">View any previous versions, complete with comments and commit messages. Compare and revert your files with a single click.</p>
            </Col>
          </Row>
        </Container>
        <div className={ classes.bgWhite }>
          <Container>
            <Row className={ secionClasses }>
              <Col className="flex-order-xs-2 flex-xs-100 flex-gt-xs-50 lg">
                <h4 className="text-title-2">Access your files anywhere</h4>
                <p className="text-title-4">Whether you’re in the office, in the lab, or on the go, preview your files in your browser, from any device.</p>
                <p className="text-title-4">Preview hundreds of different file-types directly in your web browser.</p>
                <div className={ classNames(classes.fileIcons, 'layout-row')}>
                  <FileIcon size={ 50 } type="file" fileType="dxf" />
                  <FileIcon size={ 50 } type="file" fileType="dwg" />
                  <FileIcon size={ 50 } type="file" fileType="tex" />
                  <FileIcon size={ 50 } type="file" fileType="xlsx" />
                  <FileIcon size={ 50 } type="file" fileType="cpp" />
                  <FileIcon size={ 50 } type="file" fileType="more" />
                </div>
              </Col>
              <Col className="flex-order-xs-1 flex-xs-100 flex-gt-xs-50 lg">
                <img className={ classes.screen } src={ deviceMockups } />
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className={ secionClasses }>
            <Col className="flex-xs-100 flex-gt-xs-50 lg">

            </Col>
            <Col className="flex-xs-100 flex-gt-xs-50 lg">
              <h4 className="text-title-2">No more miscommunication</h4>
              <p className="text-title-4">Simplify your feedback process by having clients, team members, and stakeholders comment directly on your models.</p>
              <p className="text-title-4">Stay informed of discussions and project milestones as soon as they happen.</p>
            </Col>
          </Row>
        </Container>

      </LandingLayout>
    )
  }
}

