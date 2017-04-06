// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from './Tasks.actions.js';

// Component Core
import React from 'react';
import { filterBoard, getAllTasks } from './Tasks.utils.js';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './Tasks.css';

// Sub Components
import Input                from 'stemn-shared/misc/Input/Input/Input';
import TasksFilterMenu      from './TasksFilterMenu/TasksFilterMenu.jsx';
import TaskList             from './TaskList/TaskList.jsx';
import Button               from 'stemn-shared/misc/Buttons/Button/Button'
import MdSearch             from 'react-icons/md/search';
import Popover              from 'stemn-shared/misc/Popover';
import Guide                from 'stemn-shared/misc/Guide/Guide';
import cardsColumns         from './graphics/cards-columns.svg';
import cardsStacked         from './graphics/cards-stacked.svg';
import LoadingOverlay       from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

const layouts = [{
  text: 'Layout: List',
  value: 'list'
},{
  text: 'Layout: Board',
  value: 'board'
}];



export const Tasks = React.createClass({
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
    const { tasks, board, boardModel, project, projectBoards } = this.props;
    const { hideGuide } = this.state;

    const guideTemplate = () => {
      const guideInfo = [{
        title: 'Drag and drop to organize your work',
        description: 'Organize task cards on a kanban-style board. Add due-dates, labels, file references and collaborate with teammates.',
        image: cardsColumns,
      },{
        title: 'Track tasks from beginning to end',
        description: 'See what your team has worked on. Tasks are linked to files as they are completed. View files before and after the task was completed.',
        image: cardsStacked,
      }]
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

    const tasksTemplate = () => {
      const layout = board && board.layout == 'list' ? 'list' : 'board';
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
            <Popover preferPlace="below">
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
            </Popover>
            <Popover preferPlace="below">
              <Button style={{marginLeft: '10px'}} className="primary">Filter</Button>
              <TasksFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/>
            </Popover>
          </div>
          <TaskList className={classes.tasks} board={filterBoard(board, tasks, board.searchString)} layout={layout}/>
        </div>
      )
    }

    const getTemplate = () => {
      const numTasks = has(board, 'data.groups') ? getAllTasks(board.data.groups).length : '';
      if(numTasks == 0 && !hideGuide){
        return guideTemplate();
      }
      else if(has(board, 'data.groups')){
        return tasksTemplate();
      }
      else{
        return null
      }
    }

    const isLoading = !projectBoards || (projectBoards && projectBoards.loading && !has(board, 'data.groups'));
    return (
      <div className="layout-column flex rel-box">
        <LoadingOverlay show={isLoading} />
        {!isLoading ? getTemplate() : null}
      </div>
    )
  }
});



///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, projects }, {projectId}) {
  const projectBoards = tasks.projects[projectId];
  const board = projectBoards && projectBoards.boards ? tasks.boards[projectBoards.boards[0]] : {};
  return {
    tasks: tasks.data,
    project: projects[projectId],
    projectBoards,
    board,
    boardModel: board && board.data && board.data._id ? `tasks.boards.${board.data._id}` : '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
