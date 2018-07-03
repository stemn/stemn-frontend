import React, { Component } from 'react'
import classes from './ProjectPipelines.css'
import { get, range } from 'lodash'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Panel from 'stemn-shared/misc/Panels/Panel'
import SubSubHeader from 'modules/SubSubHeader'
import Pagination from 'stemn-shared/misc/Pagination'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import PipelinesEmpty from 'stemn-shared/misc/Pipelines/PipelinesEmpty'
import PipelineList from 'stemn-shared/misc/Pipelines/PipelineList'

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
      location: 'replace',
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
  renderInner() {
    const {
      projectId,
      pipelines,
      location,
      page,
      size,
      filterIsDefault,
    } = this.props

    const isLoaded = pipelines && pipelines.data
    const isLoading = !pipelines || pipelines.loading
    const noMoreResults = pipelines && pipelines.data && pipelines.data.length < size
    const hasResults = pipelines && pipelines.data  && pipelines.data.length > 0
    const projectRouteParams = { projectId }

    if (isLoading || hasResults) {
      return (
        <div>
          <PipelineList
            pipelines={ isLoaded ? pipelines.data : range(8) }
          />
          <Pagination
            path={ location.pathname }
            page={ page }
            noMoreResults={ noMoreResults }
          />
        </div>
      )
    } else if (filterIsDefault) {
      return <PipelinesEmpty projectRouteParams={ projectRouteParams } />
    } 
    return (
      <Panel className="text-title-5">
          No timeline events found. <a className="link-primary" onClick={ this.clearFilter }>Reset Filter</a>
      </Panel>
    )
  }
  render() {
    const {
      project,
      filter,
    } = this.props
    const team = get(project, 'data.team', [])

    const userFilterOptions = [
      ...team.map(user => ({
        name: user.name,
        value: user._id,
        onClick: () => { this.changeUserFilter(user._id) },
      })), {
        name: 'Any',
        value: undefined,
        onClick: () => { this.changeUserFilter(undefined) },
      },
    ]

    const typeFilterOptions = [{
      value: undefined,
      name: 'Any',
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
    }]

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
                style={ { marginRight: '15px' } }
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
          <Container>
            { this.renderInner() }
          </Container>
        </div>
      </div>
    )
  }
}
