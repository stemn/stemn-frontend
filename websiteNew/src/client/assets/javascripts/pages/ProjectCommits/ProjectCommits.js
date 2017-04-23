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
import Pagination from 'stemn-shared/misc/Pagination'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import MdExpandMore from 'react-icons/md/expand-more'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'

export default class ProjectCommits extends Component {
  renderLoaded() {
    const { project, syncTimeline, location } = this.props
    const page = 1
    const noMoreResults = false

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
          <Pagination
            path={ location.pathname }
            page={ page }
            noMoreResults={ noMoreResults }
          />
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
          <div className="layout-row">
            <SearchInput
              placeholder="Search History"
            />
            <div className="flex" />
            <Button className="light">
              Type: Commits
              <MdExpandMore style={ { marginLeft: '5px' } } />
            </Button>
          </div>
        </SubSubHeader>
        <LoadingOverlay show={ !isLoaded } hideBg />
        { isLoaded
        ? this.renderLoaded()
        : null }
      </div>
    )
  }
}
