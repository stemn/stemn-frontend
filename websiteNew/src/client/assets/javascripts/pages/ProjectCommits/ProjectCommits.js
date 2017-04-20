import React, { Component } from 'react'

import classes from './ProjectCommits.css'

import moment from 'moment'
import { groupBy } from 'lodash'

import { Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import HistoryGraph from 'stemn-shared/misc/Graphs/HistoryGraph'
import TimelineVertical from 'stemn-shared/misc/TimelineVertical/TimelineVertical'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';
import SubSubHeader from 'modules/SubSubHeader'

export default class ProjectCommits extends Component {
  renderLoaded() {
    const { project, syncTimeline } = this.props

    return (
      <div>
        <Container>
          <div className={ classes.graphPanel }>
            <HistoryGraph />
          </div>
          <InfoPanel>
            <TimelineVertical
              group
              items={ syncTimeline.data }
              type="project"
            />
          </InfoPanel>
        </Container>
      </div>
    )
  }
  render() {
    const { project, syncTimeline } = this.props
    const isLoaded = syncTimeline && syncTimeline.data

    return (
      <div className={ classes.content }>
        <SubSubHeader className={ classes.subHeader }>
          <div>here</div>
        </SubSubHeader>
        <LoadingOverlay show={ !isLoaded } hideBg />
        { isLoaded
        ? this.renderLoaded()
        : null }
      </div>
    )
  }
}
