import React, { Component } from 'react';

import classNames from 'classnames'
import classes from './ProjectsTasks.css'

import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import TaskList from 'stemn-shared/misc/Tasks/TaskList/TaskList.jsx'
import { filterBoard } from 'stemn-shared/misc/Tasks/Tasks.utils.js';


export default class ProjectsTasks extends Component {
  render() {
    const { project, board, tasks } = this.props
    const layout = 'board'

    console.log(this.props)

    if (board && tasks) {
      return (
        <div className={ classes.content + ' layout-column flex' }>
          <TaskList
            className={ classes.tasks }
            board={ filterBoard(board, tasks, board.searchString) }
            layout={ layout }
          />
        </div>
      )
    } else {
      return <div>Here</div>
    }
  }
};

