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
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx'
import MdDone from 'react-icons/md/done'
import MdAccessTime from 'react-icons/md/access-time'
import TaskLabelDots from 'stemn-shared/misc/Tasks/TaskLabelDots/TaskLabelDots.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import Input from 'stemn-shared/misc/Input/Input/Input'

export default class ProjectTask extends Component {
  updateTask = () => {
    setTimeout(() => this.props.updateTask({
      task: this.props.task.data
    }), 1);
  }
  dropdownOptions = [{
    value: 'open',
    name: 'Status: Open',
    onClick: () => console.log('here'),
  }, {
    value: 'closed',
    name: 'Status: Closed',
    onClick: () => console.log('here'),
  }]
  sidebarEdit = () => {
    const { task, board, taskModel } = this.props
    const group = board.data.groups.find(group => group._id === task.data.group)

    return (
      <Col className="flex-gt-xs-30 flex-order-xs-0">
        <div className={ classes.panel }>
          <div className="text-mini-caps">Group</div>
          { group.name }
        </div>
        { task.data.labels && task.data.labels.length > 0 &&
          <div className={ classes.panel }>
            <div className="text-mini-caps">Labels</div>
            <TaskLabelDots
              labels={ task.data.labels }
              labelInfo={ board.data.labels }
              tag
            />
          </div>
        }
        <div className={ classes.panel }>
          <div className="text-mini-caps">Assignees</div>
          { task.data.users.map(user => (
            <Link
              name="userRoute"
              params={ { userId: user._id } }
              className="layout-row layout-align-start-center"
            >
              <UserAvatar
                className={ classes.avatar }
                name={ user.name }
                picture={ user.picture }
                size={ 30 }
                shape='square'
              />
              <div>{ user.name }</div>
            </Link>
          ))}
        </div>
      </Col>
    )
  }
  sidebarNonEdit = () => {
    const { task, board } = this.props
    const group = board.data.groups.find(group => group._id === task.data.group)

    return (
      <Col className="flex-gt-xs-30 flex-order-xs-0">
        <div className={ classes.panel }>
          <div className="text-mini-caps">Group</div>
          { group.name }
        </div>
        { task.data.labels && task.data.labels.length > 0 &&
          <div className={ classes.panel }>
            <div className="text-mini-caps">Labels</div>
            <TaskLabelDots
              labels={ task.data.labels }
              labelInfo={ board.data.labels }
              tag
            />
          </div>
        }
        <div className={ classes.panel }>
          <div className="text-mini-caps">Assignees</div>
          { task.data.users.map(user => (
            <Link
              name="userRoute"
              params={ { userId: user._id } }
              className="layout-row layout-align-start-center"
            >
              <UserAvatar
                className={ classes.avatar }
                name={ user.name }
                picture={ user.picture }
                size={ 30 }
                shape='square'
              />
              <div>{ user.name }</div>
            </Link>
          ))}
        </div>
      </Col>
    )
  }
  render() {
    const { task, project, board, taskModel, taskId, timeline } = this.props
    
    if (task && task.data && board && board.data) {

      const userRouteParams = {
        userId: task.data.owner._id
      }
      const edit = true

      return (
        <div>
          <SubSubHeader>
            <h2 className={ classes.title }>
              { edit
              ? <Input
                  model={ `${taskModel}.data.name` }
                  className="input-plain"
                  value={ task.data.name }
                />
              : <span>{ task.data.name }</span> }
              { edit
              ? null
              : <span className={ classes.number }>&nbsp;#T23</span> }
            </h2>
            <div className={ classNames('layout-row layout-align-start-center', classes.meta) }>
              <Link
                name="userRoute"
                params={ userRouteParams }
                className="layout-row layout-align-start-center"
              >
                <UserAvatar
                  className={ classes.avatar }
                  name={ task.data.owner.name }
                  picture={ task.data.owner.picture }
                  size={ 20 }
                  shape='square'
                />
                <b>{ task.data.owner.name }</b>
              </Link>
              <div>&nbsp;created this thread { moment(task.data.created).fromNow() }.</div>
              <div className="flex" />
              <PopoverDropdown
                value={ 'open' }
                options={ this.dropdownOptions }
                style={ { margin: '0 15px' } }
              />
              { edit
              ? <Button className="primary">
                  Save
                </Button>
              : <Button className="primary">
                  Edit
                </Button> }


            </div>
          </SubSubHeader>
          <Container style={ { marginTop: '30px' } }>
            <Row className="layout-xs-column layout-gt-xs-row">
              <Col className="flex flex-order-xs-1">
                <div className={ classes.newComment }>
                  <CommentNew 
                    taskId={ taskId } 
                  />
                </div>
              </Col>
              { edit
              ? this.sidebarEdit()
              : this.sidebarNonEdit() }
            </Row>
          </Container>
        </div>
      )
    } else {
      return null
    }
  }
}

//                { timeline && timeline.length > 0 &&
//                  <TimelineVertical
//                    className={ classes.timeline }
//                    items={ timeline }
//                    entity={ board }
//                    type="task"
//                  />
//                }

//              <Tag className="success">
//                <MdDone size={ 20 } style={ { marginRight: '5px' } }/>
//                OPEN
//              </Tag>
//              <Tag className="primary">
//                <MdAccessTime size={ 20 } style={ { marginRight: '5px' } }/>
//                {`Due ${ moment(task.data.due).fromNow() }`}
//              </Tag>

//
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Related Files</div>
//                </div>

//import React, { Component } from 'react'
//import moment from 'moment'
//import classes from './ProjectTask.css'
//import classNames from 'classnames'
//import { Row, Col, Container } from 'stemn-shared/misc/Layout'
//import SubSubHeader from 'modules/SubSubHeader'
//import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
//import Tag from 'stemn-shared/misc/Tags/Tag'
//import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker'
//import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx'
//import TaskTimeline from 'stemn-shared/misc/Tasks/TaskTimeline/TaskTimeline'
//import LabelSelect from 'stemn-shared/misc/Tasks/LabelSelect/LabelSelect'
//import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx'
//import MdDone from 'react-icons/md/done'
//import MdAccessTime from 'react-icons/md/access-time'
//
//
//export default class ProjectTask extends Component {
//  updateTask = () => {
//    setTimeout(() => this.props.updateTask({
//      task: this.props.task.data
//    }), 1);
//  }
//  render() {
//    const { task, project, board, taskModel, taskId } = this.props
//    console.log(task, board);
//
//    if (task && task.data && board && board.data) {
//      const group = board.data.groups.find(group => group._id === task.data.group)
//
//      return (
//        <div>
//          <SubSubHeader>
//            <h2 className={ classes.title }>
//              <span>{ task.data.name }</span>
//              <span className={ classes.number }>&nbsp;#T23</span>
//            </h2>
//            <div className={ classNames('layout-row layout-align-start-center', classes.meta) }>
//              <UserAvatar
//                className={ classes.avatar }
//                name={ task.data.owner.name }
//                picture={ task.data.owner.picture }
//                size={ 20 }
//                shape='square'
//              />
//              <b>{ task.data.owner.name }</b>
//              <div>&nbsp;created this thread { moment(task.data.created).fromNow() }.</div>
//              <div className="flex" />
//              <Tag className="success">
//                <MdDone size={ 20 } style={ { marginRight: '5px' } }/>
//                OPEN
//              </Tag>
//              <Tag className="primary">
//                <MdAccessTime size={ 20 } style={ { marginRight: '5px' } }/>
//                {`Due ${ moment(task.data.due).fromNow() }`}
//              </Tag>
//            </div>
//          </SubSubHeader>
//          <Container style={ { marginTop: '30px' } }>
//            <Row className="layout-row">
//              <Col className="flex">
//                <TaskTimeline
//                  className={ classes.timeline }
//                  taskId={ taskId }
//                  board={ board }
//                />
//                <div className={ classes.newComment }>
//                  <CommentNew
//                    taskId={ taskId }
//                  />
//                </div>
//              </Col>
//              <Col className="flex-30">
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Group</div>
//                  { group.name }
//                </div>
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Labels</div>
//                  { group.name }
//                </div>
//              </Col>
//            </Row>
//          </Container>
//        </div>
//      )
//    } else {
//      return null
//    }
//  }
//}


//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Classification</div>
//                  <DatePicker
//                    model={ `${taskModel}.data.due` }
//                    onChange={ this.updateTask }
//                    value={ task.data.due }
//                  />
//                </div>
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Labels</div>
//                  <LabelSelect
//                    model={ `${taskModel}.data.labels` }
//                    value={ task.data.labels }
//                    onChange={ this.updateTask }
//                    labelInfo={ board.data.labels }
//                  />
//                </div>
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Assigned Users</div>
//                  <UserSelect
//                    model={ `${taskModel}.data.users` }
//                    onChange={ this.updateTask }
//                    value={ task.data.users }
//                    users={ project.data.team }
//                  />
//                </div>
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Due Date</div>
//                   <DatePicker
//                    model={ `${taskModel}.data.due` }
//                    onChange={ this.updateTask }
//                    value={ task.data.due }
//                  />
//                </div>
