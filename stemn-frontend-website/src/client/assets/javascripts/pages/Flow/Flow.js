import React, { Component } from 'react'

import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import { Container } from 'stemn-shared/misc/Layout'
import { Helmet } from 'react-helmet'

export default class Flow extends Component {
  render() {
    return (
      <LandingLayout>
        <Helmet>
          <title>Stemn Workflow</title>
        </Helmet>
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
