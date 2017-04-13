import React, { Component, PropTypes } from 'react'

import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Container } from 'stemn-shared/misc/Layout'

import classes from './OpenSource.scss'

export default class OpenSource extends Component {
  render() {
    return (
      <LandingLayout>
        <HeroBanner>
          <h1>Download Stemn Desktop</h1>
          <h3>Collaboration tools for Engineers</h3>
        </HeroBanner>
        <Container>
          Open Source
        </Container>
      </LandingLayout>
    )
  }
}
