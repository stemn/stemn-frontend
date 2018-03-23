import React, { Component } from 'react'
import classes from './ProjectPipelines.css'
import classNames from 'classnames'
import moment from 'moment'
import { get } from 'lodash'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import Panel from 'stemn-shared/misc/Panels/Panel';
import SubSubHeader from 'modules/SubSubHeader'
import Pagination from 'stemn-shared/misc/Pagination'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import HistoryEmpty from 'stemn-shared/misc/SyncTimeline/HistoryEmpty'
import PipelineList from 'stemn-shared/misc/Pipelines/PipelineList'
import HistoryGraph from 'stemn-shared/misc/History/HistoryGraph'

export default class ProjectPipelines extends Component {
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
    const { project, pipelines, location, page, size, filter, filterIsDefault, board } = this.props

    const noMoreResults = pipelines && pipelines.data.length < size
    const hasResults = pipelines && pipelines.data  && pipelines.data.length > 0
    const projectRouteParams = {
      projectId: project.data._id,
    }

    if (hasResults) {
      return (
        <div>
          <div className={classes.graphPanel}>
            <HistoryGraph
              entityType={ filter.object.user ? 'user' : 'project' }
              entityId={ filter.object.user ? filter.object.user : project.data._id }
              type={ filter.object.type }
              parentType={ filter.object.user ? 'project' : undefined }
              parentId={ filter.object.user ? project.data._id : undefined }
            />
          </div>
          <PipelineList
             pipelines={ pipelines.data } 
          />
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
        <Panel className="text-title-5">
          No timeline events found. <a className="link-primary" onClick={ this.clearFilter }>Reset Filter</a>
        </Panel>
      )
    }
  }
  render() {
    const { project, pipelines, filter } = this.props
    const isLoaded = pipelines && pipelines.data
    const isLoading = !pipelines || pipelines.loading

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
      value: undefined,
      name: 'All',
      onClick: () => { this.changeTypeFilter(undefined) },
    }, {
      value: 'pending',
      name: 'Pending',
      onClick: () => { this.changeTypeFilter('pending') },
    }, {
      value: 'finished',
      name: 'Finished',
      onClick: () => { this.changeTypeFilter('finished') },
    }, {
      value: 'success',
      name: 'Success',
      onClick: () => { this.changeTypeFilter('success') },
    }, {
      value: 'failed',
      name: 'Failed',
      onClick: () => { this.changeTypeFilter('failed') },
    }, ]

    return (
      <div className={ classes.content }>
        <SubSubHeader className={ classes.subHeader }>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className="flex-xs flex-sm flex-gt-sm-30 layout-row">
              <SearchInput
                className={ classes.search }
                placeholder="Search Pipelines"
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
                style={ { marginRight: '15px'} }
              >
                User:&nbsp;
              </PopoverDropdown>
              <PopoverDropdown
                className="flex-xs"
                value={ filter.object.type }
                options={ typeFilterOptions }
              >
                Status:&nbsp;
              </PopoverDropdown>
            </Col>
          </Row>

          <div className="layout-row">

            <div className="flex" />

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
