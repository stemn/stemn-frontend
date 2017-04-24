import React, { Component, PropTypes } from 'react'

import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Container } from 'stemn-shared/misc/Layout'

import classes from './Flow.scss'

export default class Flow extends Component {
  render() {
    return (
      <LandingLayout>
        <HeroBanner>
          <h1>Understand the Stemn Workflow</h1>
          <h3>A unified workflow for modern engineers</h3>
        </HeroBanner>
        <Container>
          Some content
        </Container>
      </LandingLayout>
    )
  }
}
