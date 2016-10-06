// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

// Container Actions
import * as TasksActions from './Tasks.actions.js';

// Component Core
import React from 'react';
import i from 'icepick';
import { every } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './Tasks.css';

// Sub Components
import { Field } from 'react-redux-form';
import TaskList from './TaskList/TaskList.jsx';
import Button from 'app/renderer/main/components/Buttons/Button/Button'
import { MdSearch } from 'react-icons/lib/md';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';


///////////////////////////////// COMPONENT /////////////////////////////////

const layouts = [{
  text: 'Layout: List',
  value: 'list'
},{
  text: 'Layout: Board',
  value: 'board'
}];

const queryByString = (item, queryString) => {
  if     (queryString == 'is:complete' || queryString == 'is:!complete'){
    return item.data.complete
  }
  else if(queryString == 'is:incomplete'){
    return !item.data.complete
  }
  // Filter by the string itself (case independent)
  else if(queryString && queryString.length > 0){
    return new RegExp(queryString, 'i').test(item.data.name)
  }
  else{
    return true;
  }
}

const queryByStrings = (item, queryStringArray) => {
  return every(queryStringArray, queryString => queryByString(item, queryString))
}

const statusFilter = [{
  text: 'Status: Complete',
  value: 'is:complete',
},{
  text: 'Status: Incomplete',
  value: 'is:incomplete',
},{
  text: 'Status: All',
  value: ''
}];

const ownerFilter = [{
  text: 'My Tasks',
  value: 'author:DavidRevay'
},{
  text: 'All Tasks',
  value: ''
}];

export const Component = React.createClass({
  componentWillMount() {
    this.props.TasksActions.getBoard({
      projectId: this.props.projectId
    })
  },
  getInitialState () {
    return { layout: 'board' }
  },
  setLayout (layout) {
    this.setState({ layout: layout }) // layout = 'board' || 'list'
  },
  addFilter(filterArray, filterString) {
    let newSearchString = this.props.board.searchString;
    filterArray.forEach(filterObject => { newSearchString = replaceWord(newSearchString, filterObject.value, '') }); // Clear the search string
    newSearchString = filterString ? `${newSearchString} ${filterString}` : newSearchString;                         // Add the new filterString
    this.props.dispatch(actions.change(`${this.props.boardModel}.searchString`, newSearchString))
  },

  filterBoard(board, tasks) {
    const queryStringArray = board.searchString ? board.searchString.split(' ') : [];
    return i.updateIn(board, ['data', 'groups'], groups =>
      filterGroups({groups, tasks, filterFn: (task) => {
        return task && task.data ? queryByStrings(task, queryStringArray) : true;
      }})
    )
  },
  render() {
    const { tasks, board, boardModel, project } = this.props;

    if(!board || !board.data || !board.data.groups){
      return null
    }

    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className={classes.search}>
            <Field model={`${boardModel}.searchString`}>
              <input className="dr-input text-ellipsis" type="text" placeholder="Search tasks"/>
            </Field>
            <MdSearch size="25"/>
          </div>
          <div className="flex"></div>
          <PopoverMenu preferPlace="below">
            <Button style={{marginLeft: '10px'}} className="white">Layout</Button>
            <div className="PopoverMenu">
              {layouts.map((layout, index) =>
               <a key={index}
                 className={classNames({'active' : this.state.layout == layout.value})}
                 onClick={()=>this.setLayout(layout.value)}>
                 {layout.text}
               </a>
              )}
            </div>
          </PopoverMenu>
          <PopoverMenu preferPlace="below">
            <Button style={{marginLeft: '10px'}} className="primary">Filter</Button>
            <div className="PopoverMenu">
              {statusFilter.map((item, index) =>
               <a key={index}
                 className={classNames({'active' : isFilterActive(statusFilter, item.value, board.searchString)})}
                 onClick={()=>this.addFilter(statusFilter, item.value)}>
                 {item.text}
               </a>
              )}
              <div className="divider"></div>
              {ownerFilter.map((item, index) =>
               <a key={index}
                 className={classNames({'active' : isFilterActive(ownerFilter, item.value, board.searchString)})}
                 onClick={()=>this.addFilter(ownerFilter, item.value)}>
                 {item.text}
               </a>
              )}
            </div>
          </PopoverMenu>
        </div>
        <TaskList className={classes.tasks} board={this.filterBoard(board, tasks)} layout={this.state.layout}/>
      </div>
    )
  }
});

function filterGroups({groups, tasks, filterFn}){
  return groups.map(group => {
    return i.updateIn(group, ['tasks'], taskIds => {
      return taskIds.filter(taskId => filterFn(tasks[taskId]))
    })
  })
}
function isFilterActive(filterArray, filterString, searchString){
  if(filterString == ''){
    // If none of the other keys in this filter are active, set this one to active
    return filterArray.findIndex(filterObject => filterObject.value != '' ? stringContainsWord(searchString, filterObject.value) : false) == -1;
  }
  else{
    // Check if the search string contains the filterString
    return stringContainsWord(searchString, filterString)
  }
}

function stringContainsWord(fullString, word){
  return fullString && fullString.length > 0 ? fullString.match(new RegExp('(^|\\s+)'+word+'(\\s+|$)')) : false;
}
function replaceWord(fullString, word, newWord){
  return fullString.replace(new RegExp('(^|\\s+)'+word), newWord);
}

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, projects }, {projectId}) {
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  return {
    tasks: tasks.data,
    project: projects[projectId],
    board: board,
    boardModel: board && board.data && board.data._id ? `tasks.boards.${board.data._id}` : ''
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
