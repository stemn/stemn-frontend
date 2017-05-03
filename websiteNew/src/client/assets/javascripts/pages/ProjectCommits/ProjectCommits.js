import React, { Component } from 'react'

import classes from './ProjectCommits.css'

import moment from 'moment'
import { get, groupBy } from 'lodash'

import { Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import HistoryGraph from 'stemn-shared/misc/Graphs/HistoryGraph'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';
import SubSubHeader from 'modules/SubSubHeader'
import Pagination from 'stemn-shared/misc/Pagination'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'


export default class ProjectCommits extends Component {
  changeTypeFilter = (filterType) => {
    const { setFilter, projectId, filterModel, filter } = this.props
    setFilter({
      cacheKey: projectId,
      filterObject: {
        ...filter.object,
        type: filterType,
      },
      filterModel,
      location: 'push',
    })
  }
  changeUserFilter = (userId) => {
    const { setFilter, projectId, filterModel, filter } = this.props
    setFilter({
      cacheKey: projectId,
      filterObject: {
        ...filter.object,
        user: userId,
      },
      filterModel,
      location: 'replace',
    })
  }
  changeInput = ({ value: filterString }) => {
    const { setFilter, projectId, filterModel } = this.props
    setFilter({
      cacheKey: projectId,
      filterString,
      filterModel,
      location: 'replace',
    })
  }
  renderLoaded() {
    const { project, syncTimeline, location, page, size, filter } = this.props
    const noMoreResults = syncTimeline && syncTimeline.data.length < size

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
    const { project, syncTimeline, filter } = this.props
    const isLoaded = syncTimeline && syncTimeline.data
    const isLoading = !syncTimeline || syncTimeline.loading

    const userFilterOptions = project.data.team.map(user => ({
      name: user.name,
      value: user._id,
      onClick: () => { this.changeUserFilter(user._id) }
    }))

    userFilterOptions.push({
      name: 'None',
      value: '',
      onClick: () => { this.changeUserFilter('') }
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
          { isLoaded
          ? this.renderLoaded()
          : null }
        </div>

      </div>
    )
  }
}
