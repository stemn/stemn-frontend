import React, { Component } from 'react'

import moment from 'moment'

import classes from './ProjectTask.css'
import classNames from 'classnames'

import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Tag from 'stemn-shared/misc/Tags/Tag'
import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker'
import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx'
import TaskTimeline from 'stemn-shared/misc/Tasks/TaskTimeline/TaskTimeline'
import LabelSelect from 'stemn-shared/misc/Tasks/TaskDisplayModal/LabelSelect/LabelSelect'
import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx'

export default class ProjectTask extends Component {
  updateTask = () => {
    setTimeout(() => this.props.updateTask({
      task: this.props.task.data
    }), 1);
  }
  render() {
    const { task, project, board, taskModel, taskId } = this.props
    
    if (task && task.data && board && board.data) {
      return (
        <div>
          <SubSubHeader>
            <h2 className={ classes.title }>
              <span>{ task.data.name }</span>
              <span className={ classes.number }>&nbsp;#T23</span>
            </h2>
            <div className={ classNames('layout-row layout-align-start-center', classes.meta) }>
              <UserAvatar
                className={ classes.avatar }
                name={ task.data.owner.name }
                picture={ task.data.owner.picture }
                size={ 20 }
                shape='square'
              />
              <b>{ task.data.owner.name }</b>
              <div>&nbsp;created this thread { moment(task.data.created).fromNow() }</div>
              <div className="flex" />
              <Tag 
                text="Open Thread" 
                className={ classes.tag + ' primary' }
              />             
              <Tag 
                text={`Due ${ moment(task.data.due).fromNow() }`}
                className={ classes.tag + ' primary' }
              />
            </div>
          </SubSubHeader>
          <Container style={ { marginTop: '30px' } }>
            <Row className="layout-row">
              <Col className="flex">
                <TaskTimeline 
                  className={ classes.timeline }
                  taskId={ taskId }
                  board={ board } 
                />
                <div className={ classes.newComment }>
                  <CommentNew 
                    taskId={ taskId } 
                  />
                </div>
              </Col>             
              <Col className="flex-30">
                <div className={ classes.panel }>
                  <div className="text-mini-caps">Classification</div>
                  <DatePicker
                    model={ `${taskModel}.data.due` }
                    onChange={ this.updateTask }
                    value={ task.data.due }
                  />
                </div>                
                <div className={ classes.panel }>
                  <div className="text-mini-caps">Labels</div>
                  <LabelSelect
                    model={ `${taskModel}.data.labels` }
                    value={ task.data.labels }
                    onChange={ this.updateTask }
                    labelInfo={ board.data.labels }
                  />
                </div>                
                <div className={ classes.panel }>
                  <div className="text-mini-caps">Assigned Users</div>
                  <UserSelect
                    model={ `${taskModel}.data.users` }
                    onChange={ this.updateTask }
                    value={ task.data.users }
                    users={ project.data.team }
                  />
                </div>                
                <div className={ classes.panel }>
                  <div className="text-mini-caps">Due Date</div>
                   <DatePicker
                    model={ `${taskModel}.data.due` }
                    onChange={ this.updateTask }
                    value={ task.data.due }
                  />
                </div>
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

