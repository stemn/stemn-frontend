import React, { Component } from 'react';
import classNames from 'classnames'
import classes from './ProjectThreads.css'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import ThreadList from 'stemn-shared/misc/Threads/ThreadList/ThreadList.jsx'
import ThreadRow from 'stemn-shared/misc/Threads/ThreadRow'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Pagination from 'stemn-shared/misc/Pagination'
import MdExpandMore from 'react-icons/md/expand-more'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import Popover from 'stemn-shared/misc/Popover'
import LabelSelect from 'stemn-shared/misc/Threads/LabelSelect/LabelSelect'
import GroupSelect from 'stemn-shared/misc/Threads/GroupSelect'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { get } from 'lodash'
import ThreadsEmpty from 'stemn-shared/misc/Threads/ThreadsEmpty'

export default class ProjectThreads extends Component {
  showNewThreadModal = () => {
    this.props.showNewThreadModal({
      boardId: this.props.board.data._id,
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
  changeOpenFilter = (status) => {
    const { setFilter, filterCacheKey, filterModel, filter } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterObject: {
        ...filter.object,
        status,
      },
      filterModel,
      location: 'replace',
    })
  }
  processFilterChange = () => {
    setTimeout(() => {
      const { setFilter, filter, filterCacheKey, filterModel } = this.props
      setFilter({
        cacheKey: filterCacheKey,
        filterObject: filter.object,
        filterModel,
        location: 'replace',
      })
    }, 1)
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
  render() {
    const { project, board, threads, location, filter, boardModel, showNewThreadModal, page, size, filterStorePath, filterIsDefault } = this.props
    const noMoreResults = threads && threads.data && threads.data.length < size
    const isLoading = !threads || threads.loading
    const isLoaded = threads && threads.data && board && board.data
    const hasResults = threads && threads.data  && threads.data.length > 0

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

    const openFilterOptions = [{
      value: undefined,
      name: 'Any',
      onClick: () => { this.changeOpenFilter(undefined) },
    }, {
      value: 'open',
      name: 'Open',
      onClick: () => { this.changeOpenFilter('open') },
    }, {
      value: 'closed',
      name: 'Closed',
      onClick: () => { this.changeOpenFilter('closed') },
    }]

    return (
      <div>
        <SubSubHeader>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className="flex-xs flex-sm flex-gt-sm-30 layout-row">
              <SearchInput
                className={ classes.search }
                placeholder="Search Threads"
                value={ filter.string }
                changeAction={ this.changeInput }
              />
            </Col>
            <div className="flex-xs-0 flex-sm-0 flex-gt-sm" />
            <Col className="layout-row">
              <PopoverDropdown
                className="flex-xs"
                value={ get(filter, ['object', 'status']) }
                options={ openFilterOptions }
                style={ { marginRight: '15px'} }
              >
                Status:&nbsp;
              </PopoverDropdown>
              <PopoverDropdown
                className="flex-xs"
                value={ get(filter, ['object', 'user']) }
                options={ userFilterOptions }
                style={ { marginRight: '15px'} }
              >
                Asignee:&nbsp;
              </PopoverDropdown>
              <Button className="primary flex-xs" onClick={ this.showNewThreadModal }>
                New Thread
              </Button>
            </Col>
          </Row>
        </SubSubHeader>
        <div className={ classes.content }>
          <LoadingOverlay show={ isLoading } linear hideBg noOverlay />
          { isLoaded
          ? <Container>
              { (!filterIsDefault) || (filterIsDefault && hasResults)
              ? <Row className="layout-xs-column layout-gt-xs-row">
                  <Col className="flex-xs-100 flex-gt-xs-30">
                    <div className={ classes.panel }>
                      <h3 className="text-mini-caps">Groups</h3>
                      <GroupSelect
                        groups={ board.data.groups }
                        value={ get(filter, ['object', 'groups']) }
                        model={ `${filterStorePath}.object.groups` }
                        onChange={ this.processFilterChange }
                      />
                    </div>
                    <div className={ classes.panel }>
                      <h3 className="text-mini-caps">Labels</h3>
                      <LabelSelect
                        labelInfo={ board.data.labels }
                        value={ get(filter, ['object', 'labels']) }
                        model={ `${filterStorePath}.object.labels` }
                        onChange={ this.processFilterChange }
                      />
                    </div>
                  </Col>
                  <Col className="flex">
                    <div className={ classes.threadsPanel }>
                      { hasResults
                      ? threads.data.map(thread => (
                         <ThreadRow
                           board={ board }
                           threadId={ thread._id }
                           className={ classes.thread }
                         />
                      ))
                      : <div className={ classNames('text-title-5', classes.noResult) }>
                          No Results. <a className="link-primary"  onClick={ this.clearFilter }>Clear Filter</a>
                        </div> }
                    </div>
                    <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults }/>
                  </Col>
                </Row>
              : !isLoading && <ThreadsEmpty /> }
            </Container>
          : null }

        </div>


      </div>
    )
  }
}
