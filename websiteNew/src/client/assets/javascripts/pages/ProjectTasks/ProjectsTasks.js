import React, { Component } from 'react';
import classNames from 'classnames'
import classes from './ProjectsTasks.css'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import TaskList from 'stemn-shared/misc/Tasks/TaskList/TaskList.jsx'
import TaskRow from 'stemn-shared/misc/Tasks/TaskRow'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Pagination from 'stemn-shared/misc/Pagination'
import MdExpandMore from 'react-icons/md/expand-more'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import Popover from 'stemn-shared/misc/Popover'
import LabelSelect from 'stemn-shared/misc/Tasks/LabelSelect/LabelSelect'
import GroupSelect from 'stemn-shared/misc/Tasks/GroupSelect'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { get } from 'lodash'

export default class ProjectsTasks extends Component {
  showNewThreadModal = () => {
    this.props.showNewThreadModal({
      boardId: this.props.board.data._id,
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
  changeUserFilter = (userId) => {
    const { setFilter, projectId, filterModel, filter } = this.props
    setFilter({
      cacheKey: projectId,
      filterObject: {
        ...filter.object,
        users: [ userId ],
      },
      filterModel,
      location: 'replace',
    })
  }
  changeOpenFilter = (status) => {
    const { setFilter, projectId, filterModel, filter } = this.props
    setFilter({
      cacheKey: projectId,
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
      const { setFilter, filter, projectId, filterModel } = this.props
      setFilter({
        cacheKey: projectId,
        filterObject: filter.object,
        filterModel,
        location: 'replace',
      })
    }, 1)
  }
  render() {
    const { project, board, threads, location, filter, boardModel, showNewThreadModal, page, size, filterStorePath } = this.props
    const noMoreResults = threads && threads.data && threads.data.length < size
    const isLoading = !threads || threads.loading

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
          <Row className="layout-row">
            <Col className="flex-xs flex-sm flex-gt-sm-30 layout-row">
              <SearchInput
                style={ { width: '100%' } }
                placeholder="Search Threads"
                value={ filter.string }
                changeAction={ this.changeInput }
              />
            </Col>
            <div className="flex-xs-0 flex-sm-0 flex-gt-sm" />
            <Col className="layout-row">
              <PopoverDropdown
                value={ get(filter, ['object', 'status']) }
                options={ openFilterOptions }
                style={ { marginRight: '15px'} }
              >
                Status:&nbsp;
              </PopoverDropdown>
              <PopoverDropdown
                value={ get(filter, ['object', 'users', '0']) }
                options={ userFilterOptions }
                style={ { marginRight: '15px'} }
              >
                Asignee:&nbsp;
              </PopoverDropdown>
              <Button className="primary" onClick={ this.showNewThreadModal }>
                New Thread
              </Button>
            </Col>
          </Row>
        </SubSubHeader>
        { board && board.data
        ? <Container className={ classes.content }>
            <Row className="layout-xs-column layout-gt-xs-row">
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
                  <LoadingOverlay show={ isLoading } linear hideBg noOverlay />
                  { threads && threads.data && threads.data.length > 0
                  ? threads.data.map(task => (
                     <TaskRow
                       board={ board }
                       taskId={ task._id }
                       className={ classes.thread }
                     />
                  ))
                  : <div>No Results</div> }
                </div>
                <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults }/>
              </Col>
            </Row>
          </Container>
        : null }

      </div>
    )
  }
}
