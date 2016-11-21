// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from './Tasks.actions.js';

// Component Core
import React from 'react';
import { filterBoard, getAllTasks } from './Tasks.utils.js';

// Styles
import classNames from 'classnames';
import classes from './Tasks.css';

// Sub Components
import Input from 'app/renderer/main/components/Input/Input/Input';
import TasksFilterMenu from './TasksFilterMenu/TasksFilterMenu.jsx';
import TaskList from './TaskList/TaskList.jsx';
import Button from 'app/renderer/main/components/Buttons/Button/Button'
import MdSearch from 'react-icons/md/search';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import Guide from 'app/renderer/main/modules/Guide/Guide';
import cardsColumns from './graphics/cards-columns.svg';
import cardsStacked from './graphics/cards-stacked.svg';


///////////////////////////////// COMPONENT /////////////////////////////////

const layouts = [{
  text: 'Layout: List',
  value: 'list'
},{
  text: 'Layout: Board',
  value: 'board'
}];

const guideInfo = [{
  title: 'Drag and drop to organize your work',
  description: 'Organize task cards on a kanban-style board. Add due-dates, labels, file references and collaborate with teammates.',
  image: cardsColumns,
},{
  title: 'Track tasks from beginning to end',
  description: 'See what your team has worked on. Tasks are linked to files as they are completed. View files before and after the task was completed.',
  image: cardsStacked,
}]

export const Component = React.createClass({
  getInitialState () {
    return {
      hideGuide: false,
    }
  },
  getStarted(toState) {
    this.setState({ hideGuide: true })
  },
  componentWillMount() {
    this.props.TasksActions.getBoards({
      projectId: this.props.projectId
    })
  },
  setLayout (layout) {
    this.props.TasksActions.changeLayout({
      layout,
      boardId: this.props.board.data._id
    })
  },
  render() {
    const { tasks, board, boardModel, project } = this.props;
    const { hideGuide } = this.state;

    if(!board || !board.data || !board.data.groups){ return null };

    const numTasks = getAllTasks(board.data.groups).length;
    const layout = board && board.layout == 'list' ? 'list' : 'board';

    if(numTasks == 0 && !hideGuide){
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center">
            <Guide data={guideInfo[0]}/>
            <Guide data={guideInfo[1]}/>
          </div>
          <div className="layout-row layout-align-center">
            <Button className="primary lg" onClick={this.getStarted}>Get started with Tasks</Button>
          </div>
        </div>
      )
    }
    else{
      return (
        <div className="layout-column flex layout-align-center">
          <div className={classes.header + ' layout-row layout-align-start-center'}>
            <div className={classes.search}>
              <Input
                model={`${boardModel}.searchString`}
                value={board.searchString}
                className="dr-input text-ellipsis"
                type="text"
                placeholder="Search tasks"
              />
              <MdSearch size="25"/>
            </div>
            <div className="flex"></div>
            <PopoverMenu preferPlace="below">
              <Button style={{marginLeft: '10px'}} className="white">Layout</Button>
              <div className="PopoverMenu">
                {layouts.map((layoutOpt, index) =>
                 <a key={index}
                   className={classNames({'active' : layout == layoutOpt.value})}
                   onClick={()=>this.setLayout(layoutOpt.value)}>
                   {layoutOpt.text}
                 </a>
                )}
              </div>
            </PopoverMenu>
            <PopoverMenu preferPlace="below">
              <Button style={{marginLeft: '10px'}} className="primary">Filter</Button>
              <TasksFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/>
            </PopoverMenu>
          </div>
          <TaskList className={classes.tasks} board={filterBoard(board, tasks, board.searchString)} layout={layout}/>
        </div>
      )
    }
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
