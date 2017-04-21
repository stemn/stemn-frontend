import React, { Component } from 'react';
import classNames from 'classnames'
import classes from './ProjectsTasks.css'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import TaskList from 'stemn-shared/misc/Tasks/TaskList/TaskList.jsx'
import { filterBoard } from 'stemn-shared/misc/Tasks/Tasks.utils.js'
import MdSearch from 'react-icons/md/search'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

const SearchBox = () => (
  <div className={ classNames(classes.search, 'layout-row layout-align-start-center') }>
    <Input
      className="flex"
      placeholder="Search Threads"
    />
    <MdSearch className={ classes.icon } size={ 20 }/>
  </div>
)

export default class ProjectsTasks extends Component {
  render() {
    const { project, board, tasks } = this.props
    const layout = 'list'


    if (board && tasks) {
      console.log(filterBoard(board, tasks, board.searchString))
      return (
        <div>
          <SubSubHeader>
            <div className="layout-row">
              <SearchBox />
              <div className="flex" />
              <Button className="primary">
                New Issue
              </Button>
            </div>
          </SubSubHeader>
          <Container className={ classes.content }>
            <div className={ classes.panel }>
              lorem
            </div>
          </Container>
        </div>
      )
    } else {
      return null
    }
  }
};

//        <div className={ classes.content + ' layout-column flex' }>
//          <TaskList
//            className={ classes.tasks }
//            board={ filterBoard(board, tasks, board.searchString) }
//            layout={ layout }
//          />
