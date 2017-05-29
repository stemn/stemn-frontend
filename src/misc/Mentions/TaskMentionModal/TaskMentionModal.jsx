import React, { Component } from 'react';
import classNames from 'classnames';
import classes from './TaskMentionModal.css';
import howMany from 'stemn-shared/utils/strings/howMany.js';
import Input from 'stemn-shared/misc/Input/Input/Input';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import TaskRow from './TaskRow/TaskRow.jsx';
import MdSearch from 'react-icons/md/search';
import { filterBoard, getAllTasks } from 'stemn-shared/misc/Tasks/Tasks.utils.js';
import TasksFilterMenu from 'stemn-shared/misc/Tasks/TasksFilterMenu/TasksFilterMenu.jsx';
import Popover from 'stemn-shared/misc/Popover';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import { values } from 'lodash'
import { newMention } from 'stemn-shared/misc/Mentions/Mentions.utils'

const getMentionsFromObject = (mentionsObject, tasks) => {
  return Object.keys(mentionsObject).map(taskId => newMention({
    entityId: taskId,
    display: tasks[taskId].data.name,
    mentionType: mentionsObject[taskId] === 'complete' ? 'task-complete' : 'task'
  })
)}

const countMentions = (mentions, type) => values(mentions).filter(mentionType => mentionType === type).length

export default class TaskMentionModal extends Component {
  componentWillMount() {
    if(!this.props.board || !this.props.board.data){
      this.props.getBoards({
        projectId: this.props.projectId
      })
    }
  }
  submit = () => {
    const { mentions, mentionsModel, tasks } = this.props
    // Get the mentions
    const mentionArray = getMentionsFromObject(mentions, tasks);
    // Clear mentions
    this.props.storeChange(mentionsModel, {})
    // Return the results
    this.props.modalConfirm({ mentions: mentionArray });
  }
  cancel = () => {
    this.props.modalCancel();
  }
  setMention = ({ status, taskId }) => {
    const { mentions, storeChange, mentionsModel } = this.props
    const currentStatus = mentions[taskId]
    if (status === currentStatus) {
      storeChange(`${mentionsModel}.${taskId}`, '')
    } else {
      storeChange(`${mentionsModel}.${taskId}`, status)
    }
  }
  render() {
    const { tasks, board, mentions, boardModel } = this.props;

    const getTasks = () => {
      const filteredBoard = filterBoard(board, tasks, board.searchString);
      const numTasks = getAllTasks(board.data.groups).length;
      const numFilteredTasks = getAllTasks(filteredBoard.data.groups).length;

      if(numTasks == 0 || numFilteredTasks == 0){
        return (
          <div className="flex layout-column layout-align-center-center text-center">
            {numTasks == 0
              ? <div style={{width: '100%'}}>This project has no tasks. Add some.</div>
              : <div style={{width: '100%'}}>No results, <a className="text-primary" onClick={() => this.props.storeChange(`${boardModel}.searchString`, '')}>clear search filter.</a></div>
            }
          </div>
        )
      }
      else{
        return (
          <div className="flex scroll-box">
            { filteredBoard.data.groups.map((group, idx) => <div key={ idx }>
              { group.tasks.map(taskId => (
                <TaskRow
                  key={ taskId }
                  taskId={ taskId }
                  status={ mentions[taskId] }
                  toggleComplete={ () => this.setMention({ status: 'complete', taskId }) }
                  toggleRelated={ () => this.setMention({ status: 'related', taskId }) }
                /> )
              ) }
            </div>)}
          </div>
        )
      }
    }

    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">
          Add tasks to a commit:
        </div>
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{howMany({count: countMentions(mentions, 'complete'), adj: 'complete'}, {count: countMentions(mentions, 'related'), adj: 'related'}, 'task')}</div>
          <div className={classes.search}>
            <Input
              model={`${boardModel}.searchString`}
              value={board.searchString}
              className="dr-input"
              placeholder="Search tasks"
            />
            <Popover preferPlace="right" trigger="hoverDelay">
              <MdSearch size="20"/>
              <div><TasksFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/></div>
            </Popover>
          </div>
        </div>
        <div className="layout-column flex rel-box">
          <LoadingOverlay show={!board || !board.data} />
          { board && board.data ? getTasks() : null }
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-description-1"></div>
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>Cancel</Button>
          <Button className="primary" onClick={this.submit}>Add Tasks</Button>
        </div>
      </div>
    )
  }
}



