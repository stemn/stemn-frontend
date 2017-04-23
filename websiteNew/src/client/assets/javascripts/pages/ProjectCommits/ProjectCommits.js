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
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'

export default class ProjectCommits extends Component {
  filterOptions = [{
    value: 'commits',
    name: 'Filter: Commits',
    onClick: () => this.pushFilter('commits'),
  }, {
    value: 'revisions',
    name: 'Filter: Revisions',
    onClick: () => this.pushFilter('revisions'),
  }, {
    value: 'task-complete',
    name: 'Filter: Task Complete',
    onClick: () => this.pushFilter('task-complete'),
  }]
  pushFilter = filter => this.props.push({
    pathname: window.location.pathname,
    query: {
      filter,
    },
  })
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
    const { project, syncTimeline, filterValue } = this.props
    const isLoaded = syncTimeline && syncTimeline.data

    return (
      <div className={ classes.content }>
        <SubSubHeader className={ classes.subHeader }>
          <div className="layout-row">
            <SearchInput
              placeholder="Search History"
            />
            <div className="flex" />
            <PopoverDropdown
              value={ filterValue }
              options={ this.filterOptions }
            />
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
