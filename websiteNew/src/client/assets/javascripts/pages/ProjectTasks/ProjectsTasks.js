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

export default class ProjectsTasks extends Component {
  render() {
    const { project, board, tasks, location, boardModel } = this.props
    const layout = 'list'
    const page = 1
    const noMoreResults = false


    if (board && tasks) {
      const filteredBoard = getAllTasks(filterBoard(board, tasks, board.searchString).data.groups)
      return (
        <div>
          <SubSubHeader>
            <div className="layout-row">
              <SearchInput
                placeholder="Search Threads"
                model={ `${boardModel}.searchString` }
                value={ board.searchString }
              />
              <div className="flex" />
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
              <Button className="primary">
                New Thread
              </Button>
            </div>
          </SubSubHeader>
          <Container className={ classes.content }>
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
          </Container>
        </div>
      )
    } else {
      return null
    }
  }
}
