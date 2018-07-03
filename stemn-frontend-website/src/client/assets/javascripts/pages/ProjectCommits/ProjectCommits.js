import React, { Component } from 'react'
import classes from './ProjectCommits.css'
import { get } from 'lodash'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import HistoryGraph from 'stemn-shared/misc/History/HistoryGraph'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import Panel from 'stemn-shared/misc/Panels/Panel'
import SubSubHeader from 'modules/SubSubHeader'
import Pagination from 'stemn-shared/misc/Pagination'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import HistoryEmpty from 'stemn-shared/misc/SyncTimeline/HistoryEmpty'

export default class ProjectCommits extends Component {
  changeTypeFilter = (filterType) => {
    const { setFilter, filterCacheKey, filterModel, filter } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterObject: {
        ...filter.object,
        type: filterType,
      },
      filterModel,
      location: 'push',
    })
  }
  changeUserFilter = (userId) => {
    const { setFilter, filterCacheKey, filterModel, filter } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterObject: {
        ...filter.object,
        user: userId,
      },
      filterModel,
      location: 'replace',
    })
  }
  changeInput = ({ value: filterString }) => {
    const { setFilter, filterCacheKey, filterModel } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterString,
      filterModel,
      location: 'replace',
    })
  }
  clearFilter = () => {
    const { setFilter, filterCacheKey, filterModel, filterDefaults } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterObject: filterDefaults,
      filterModel,
      location: 'replace',
    })
  }
  renderLoaded() {
    const {
      syncTimeline,
      location,
      page,
      projectId,
      size,
      filter,
      filterIsDefault,
      board,
    } = this.props

    const noMoreResults = syncTimeline && syncTimeline.data.length < size
    const hasResults = syncTimeline && syncTimeline.data  && syncTimeline.data.length > 0
    const projectRouteParams = { projectId }
    
    if (hasResults) {
      return (
        <div>
          <div className={ classes.graphPanel }>
            <HistoryGraph
              entityType={ filter.object.user ? 'user' : 'project' }
              entityId={ filter.object.user ? filter.object.user : projectId }
              type={ filter.object.type }
              parentType={ filter.object.user ? 'project' : undefined }
              parentId={ filter.object.user ? projectId : undefined }
            />
          </div>
          <Panel>
            <TimelineVertical
              group
              items={ syncTimeline.data }
              type="project"
              entity={ board }
            />
          </Panel>
          <Pagination
            path={ location.pathname }
            page={ page }
            noMoreResults={ noMoreResults }
          />
        </div>
      )
    } else if (filterIsDefault) {
      return <HistoryEmpty projectRouteParams={ projectRouteParams } />
    } 
    return (
      <Panel className="text-title-5">
          No timeline events found. <a className="link-primary" onClick={ this.clearFilter }>Reset Filter</a>
      </Panel>
    )
  }
  render() {
    const { project, syncTimeline, filter } = this.props
    const isLoaded = syncTimeline && syncTimeline.data
    const isLoading = !syncTimeline || syncTimeline.loading
    const team = get(project, 'data.team', [])

    const userFilterOptions = team.map(user => ({
      name: user.name,
      value: user._id,
      onClick: () => { this.changeUserFilter(user._id) },
    }))

    userFilterOptions.push({
      name: 'Any',
      value: undefined,
      onClick: () => { this.changeUserFilter(undefined) },
    })

    const typeFilterOptions = [{
      value: undefined,
      name: 'All',
      onClick: () => { this.changeTypeFilter(undefined) },
    }, {
      value: 'commits',
      name: 'Commits',
      onClick: () => { this.changeTypeFilter('commits') },
    }, {
      value: 'revisions',
      name: 'Revisions',
      onClick: () => { this.changeTypeFilter('revisions') },
    }, {
      value: 'threads',
      name: 'Thread Created',
      onClick: () => { this.changeTypeFilter('threads') },
    }, {
      value: 'threadEvents',
      name: 'Thread Events',
      onClick: () => { this.changeTypeFilter('threadEvents') },
    }]

    return (
      <div className={ classes.content }>
        <SubSubHeader className={ classes.subHeader }>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className="flex-xs flex-sm flex-gt-sm-30 layout-row">
              <SearchInput
                className={ classes.search }
                placeholder="Search History"
                value={ filter.string }
                changeAction={ this.changeInput }
              />
            </Col>
            <div className="flex-xs-0 flex-sm-0 flex-gt-sm" />
            <Col className="layout-row">
              <PopoverDropdown
                className="flex-xs"
                value={ get(filter, ['object', 'user']) }
                options={ userFilterOptions }
                style={ { marginRight: '15px' } }
              >
                User:&nbsp;
              </PopoverDropdown>
              <PopoverDropdown
                className="flex-xs"
                value={ filter.object.type }
                options={ typeFilterOptions }
              >
                Type:&nbsp;
              </PopoverDropdown>
            </Col>
          </Row>

          <div className="layout-row">

            <div className="flex" />

          </div>
        </SubSubHeader>
        <div className={ classes.innerContent }>
          <Container>
            { isLoaded
              ? this.renderLoaded()
              : null }
          </Container>
        </div>
      </div>
    )
  }
}
