import React, { Component } from 'react'

import classes from './ProjectTeam.css'
import { Container } from 'stemn-shared/misc/Layout'

export default class ProjectTeam extends Component {
  render() {
    const routeParams = {}
    return (
      <div className={ classes.content }>
        <Container>
          Some contained content
        </Container>
      </div>
    )
  }
}
