// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from './Tasks.actions.js';

// Component Core
import React from 'react';
import { filterBoard } from './Tasks.utils.js';

// Styles
import classNames from 'classnames';
import classes from './Tasks.css';

// Sub Components
import { Field } from 'react-redux-form';
import TasksFilterMenu from './TasksFilterMenu/TasksFilterMenu.jsx';
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
            <TasksFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/>
          </PopoverMenu>
        </div>
        <TaskList className={classes.tasks} board={filterBoard(board, tasks, board.searchString)} layout={this.state.layout}/>
      </div>
    )
  }
});




///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, projects }, {projectId}) {
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  return {
    tasks: tasks.data,
    project: projects[projectId],
    board: board,
    boardModel: board && board.data && board.data._id ? `tasks.boards.${board.data._id}` : '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
