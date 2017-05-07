import React, { Component } from 'react'
import classes from './ProjectCommits.css'
import classNames from 'classnames'
import moment from 'moment'
import { get } from 'lodash'
import { Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import HistoryGraph from 'stemn-shared/misc/History/HistoryGraph'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';
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
    const { project, syncTimeline, location, page, size, filter, filterIsDefault } = this.props
    const noMoreResults = syncTimeline && syncTimeline.data.length < size
    const hasResults = syncTimeline && syncTimeline.data  && syncTimeline.data.length > 0
    const projectRouteParams = {
      projectId: project.data._id,
    }

    if (hasResults) {
      return (
        <div>
          <div className={ classes.graphPanel }>
            <HistoryGraph
              entityType="project"
              entityId={ project.data._id }
            />
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
        </div>
      )
    } else if ( filterIsDefault ) {
      return <HistoryEmpty projectRouteParams={ projectRouteParams } />
    } else {
      return (
        <InfoPanel className="text-title-5">
          No timeline events found. <a className="link-primary" onClick={ this.clearFilter }>Reset Filter</a>
        </InfoPanel>
      )
    }
  }
  render() {
    const { project, syncTimeline, filter } = this.props
    const isLoaded = syncTimeline && syncTimeline.data
    const isLoading = !syncTimeline || syncTimeline.loading

    const userFilterOptions = project.data.team.map(user => ({
      name: user.name,
      value: user._id,
      onClick: () => { this.changeUserFilter(user._id) }
    }))

    userFilterOptions.push({
      name: 'Any',
      value: undefined,
      onClick: () => { this.changeUserFilter(undefined) }
    })

    const typeFilterOptions = [{
      value: 'all',
      name: 'All',
      onClick: () => { this.changeTypeFilter('all') },
    }, {
      value: 'commits',
      name: 'Commits',
      onClick: () => { this.changeTypeFilter('commits') },
    }, {
      value: 'revisions',
      name: 'Revisions',
      onClick: () => { this.changeTypeFilter('revisions') },
    }, {
      value: 'task-complete',
      name: 'Task Complete',
      onClick: () => { this.changeTypeFilter('task-complete') },
    }]

    return (
      <div className={ classes.content }>
        <SubSubHeader className={ classes.subHeader }>
          <div className="layout-row">
            <SearchInput
              placeholder="Search History"
              value={ filter.string }
              changeAction={ this.changeInput }
            />
            <div className="flex" />
            <PopoverDropdown
              value={ get(filter, ['object', 'user']) }
              options={ userFilterOptions }
              style={ { marginRight: '15px'} }
            >
              User:&nbsp;
            </PopoverDropdown>
            <PopoverDropdown
              value={ filter.object.type }
              options={ typeFilterOptions }
            >
              Type:&nbsp;
            </PopoverDropdown>
          </div>
        </SubSubHeader>
        <div className={ classes.innerContent }>
          <LoadingOverlay show={ isLoading } linear hideBg noOverlay />
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
