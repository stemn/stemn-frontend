import React, { Component } from 'react'
import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import screenshot from './screenshot.jpg'
import deviceMockups from './deviceMockups.jpg'
import historyCombined from './historyCombined.jpg'
import historyTimeline from './historyTimeline.png'
import classes from './Landing.scss'
import cn from 'classnames'
import FileIcon from 'stemn-shared/misc/FileList/components/FileIcon'
import { Helmet } from 'react-helmet'
import isMobile from 'stemn-shared/utils/agent/isMobile'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import MdLock from 'react-icons/md/input'
import vidDemo from 'static/video/demo.mp4'
import Link from 'stemn-shared/misc/Router/Link'

export default class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPreview: window.screen.width > 500,
    }
  }
  render() {
    const secionClasses = cn(classes.section, 'layout-xs-column layout-gt-xs-row layout-align-gt-xs-start-center lg')
    return (
      <LandingLayout>
        <Helmet>
          <title>Stemn: Seamless Version Control and Task Tracking</title>
        </Helmet>
        <HeroBanner className={ classes.banner }>
          <h1>Seamless Version Control and Task Tracking</h1>
          <h3>A unified workflow for modern engineers</h3>
          { isMobile()
            ? <Button className={ `${classes.downloadButton} secondary lg` } name="loginRoute">
              <MdLock size={ 20 } style={ { marginRight: '10px' } } />
              Get Started
            </Button>
            : <DownloadButton className={ `${classes.downloadButton} secondary lg` } platform="auto" >
              Download Now
            </DownloadButton>
          }
          <Link
            className={ classes.screenshot }
            name="fileRoute"
            params={ { projectId: '595c9a90891a7600ba39b6d8', fileId: '595c9aaa3fccf200ba2568c7' } }
          >
            <img src={ screenshot } />
            <div className={ cn(classes.screenshotCad, 'layout-column') }>
              <video muted autoPlay loop>
                <source src={ vidDemo } type="video/mp4" />
              </video>
            </div>
          </Link>
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
                <p className="text-title-4">Whether you’re in the office, in the lab, or on the go, preview your files in your browser or any device.</p>
                <p className="text-title-4">Preview hundreds of different file-types directly in your web browser.</p>
                <div className={ cn(classes.fileIcons, 'layout-row') }>
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
              <div className={ classes.historyTimeline }>
                <img src={ historyTimeline } />
              </div>
            </Col>
            <Col className="flex-xs-100 flex-gt-xs-50 lg">
              <h4 className="text-title-2">No more miscommunication</h4>
              <p className="text-title-4">Simplify your communication between team members, clients, and stakeholders by commenting directly on files.</p>
              <p className="text-title-4">Stay informed of discussions and project events as soon as they happen.</p>
            </Col>
          </Row>
        </Container>
        <div className={ classes.cta }>
          <Container className="layout-column layout-align-center-center text-center">
            <h4 className="text-title-2">Ready?</h4>
            <p className="text-title-4">Get started for free. Download the desktop app and sign up.</p>

            { isMobile()
              ? <Button className={ `${classes.downloadButton} secondary lg` } name="loginRoute">
                <MdLock size={ 20 } style={ { marginRight: '10px' } } />
                  Get Started
              </Button>
              : <div className="layout-row layout-xs-column layout-align-center">
                <DownloadButton className={ `${classes.downloadButton} secondary lg` } platform="auto" >
                    Download Now
                </DownloadButton>
                <Button className={ `${classes.downloadButton} primary lg` } name="registerRoute">
                  <MdLock size={ 20 } style={ { marginRight: '10px' } } />
                    Sign up
                </Button>
              </div>
            }

          </Container>
        </div>

      </LandingLayout>
    )
  }
}
//
//            { showPreview &&
//              <div className={ cn(classes.screenshotCad, 'layout-column') }>
//                <PreviewCadLoader
//                  fileMeta={ { fileId: 'arduino' } }
//                  renderFn={ () => {} }
//                  fileRender={ { data: 'https://dev.stemn.com/api/v1/sync/downloadRenderFile/595c9a90891a7600ba39b6d8/595c9aaa3fccf200ba2568c7/595c9aaa3fccf200ba2568c6' } }
//                />
//
//              </div>
//            }
