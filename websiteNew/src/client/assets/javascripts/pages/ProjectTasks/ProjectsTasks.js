import React, { Component } from 'react';
import classNames from 'classnames'
import classes from './ProjectsTasks.css'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import TaskList from 'stemn-shared/misc/Tasks/TaskList/TaskList.jsx'
import TaskRow from 'stemn-shared/misc/Tasks/TaskRow'
import { filterBoard, getAllTasks } from 'stemn-shared/misc/Tasks/Tasks.utils.js'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Pagination from 'stemn-shared/misc/Pagination'
import MdExpandMore from 'react-icons/md/expand-more'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import TasksFilterMenu from 'stemn-shared/misc/Tasks/TasksFilterMenu/TasksFilterMenu'
import LabelSelect from 'stemn-shared/misc/Tasks/LabelSelect/LabelSelect'
import GroupSelect from 'stemn-shared/misc/Tasks/GroupSelect'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export default class ProjectsTasks extends Component {
  showNewProjectModal = () => {
    this.props.showNewProjectModal({
      boardId: this.props.board.data._id,
    })
  }
  render() {
    const { project, board, tasks, location, boardModel, showNewProjectModal } = this.props
    const layout = 'list'
    const page = 1
    const noMoreResults = false


    if (board && tasks) {
      const filteredBoard = getAllTasks(filterBoard(board, tasks, board.searchString).data.groups)
      return (
        <div>
          <SubSubHeader>
            <Row className="layout-row">
              <Col className="flex-xs flex-sm flex-gt-sm-30 layout-row">
                <SearchInput
                  style={ { width: '100%' } }
                  placeholder="Search Threads"
                  model={ `${boardModel}.searchString` }
                  value={ board.searchString }
                />
              </Col>
              <div className="flex-xs-0 flex-sm-0 flex-gt-sm" />
              <Col className="layout-row">
                <Popover preferPlace="below" tipSize={ 1 }>
                  <Button className="light" style={ { margin: '0 15px' } }>
                    Filter
                    <MdExpandMore style={ { marginLeft: '5px' } } />
                  </Button>
                  <TasksFilterMenu
                    model={`${boardModel}.searchString`}
                    value={board.searchString}
                  />
                </Popover>
                <Button className="primary" onClick={ this.showNewProjectModal }>
                  New Thread
                </Button>
              </Col>
            </Row>
          </SubSubHeader>
          <Container className={ classes.content }>
            <Row className="layout-xs-column layout-gt-xs-row">
              <Col className="flex-xs-100 flex-gt-xs-30">
                <div className={ classes.panel }>
                  <h3 className="text-mini-caps">Groups</h3>
                  <GroupSelect
                    groups={ board.data.groups }
                  />
                </div>
                <div className={ classes.panel }>
                  <h3 className="text-mini-caps">Labels</h3>
                  <LabelSelect
                    labelInfo={ board.data.labels }
                  />
                </div>
              </Col>
              <Col className="flex">
                <div className={ classes.threadsPanel }>
                  { filteredBoard.map(taskId => (
                     <TaskRow
                       board={ board }
                       taskId={ taskId }
                       className={ classes.thread }
                     />
                  ))}
                </div>
                <Pagination path={ location.pathname } page={ page } noMoreResults={ noMoreResults }/>
              </Col>
            </Row>
          </Container>
        </div>
      )
    } else {
      return null
    }
  }
}
