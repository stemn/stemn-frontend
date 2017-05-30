// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ThreadsActions from './Threads.actions.js';

// Component Core
import React from 'react';
import { filterBoard, getAllThreads } from './Threads.utils.js';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './Threads.css';

// Sub Components
import Input                from 'stemn-shared/misc/Input/Input/Input';
import ThreadsFilterMenu      from './ThreadsFilterMenu/ThreadsFilterMenu.jsx';
import ThreadList             from './ThreadList/ThreadList.jsx';
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



export const Threads = React.createClass({
  getInitialState () {
    return {
      hideGuide: false,
    }
  },
  getStarted(toState) {
    this.setState({ hideGuide: true })
  },
  componentWillMount() {
    this.props.ThreadsActions.getBoards({
      projectId: this.props.projectId
    })
  },
  setLayout (layout) {
    this.props.ThreadsActions.changeLayout({
      layout,
      boardId: this.props.board.data._id
    })
  },
  render() {
    const { threads, board, boardModel, project, projectBoards } = this.props;
    const { hideGuide } = this.state;

    const guideTemplate = () => {
      const guideInfo = [{
        title: 'Drag and drop to organize your work',
        description: 'Organize thread cards on a kanban-style board. Add due-dates, labels, file references and collaborate with teammates.',
        image: cardsColumns,
      },{
        title: 'Track threads from beginning to end',
        description: 'See what your team has worked on. Threads are linked to files as they are completed. View files before and after the thread was completed.',
        image: cardsStacked,
      }]
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center">
            <Guide data={guideInfo[0]}/>
            <Guide data={guideInfo[1]}/>
          </div>
          <div className="layout-row layout-align-center">
            <Button className="primary lg" onClick={this.getStarted}>Get started with Threads</Button>
          </div>
        </div>
      )
    }
    const threadsTemplate = () => {
      const layout = board && board.layout == 'list' ? 'list' : 'board';
      return (
        <div className="layout-column flex">
          <div className={classes.header + ' layout-row layout-align-start-center'}>
            <div className={classes.search}>
              <Input
                model={`${boardModel}.searchString`}
                value={board.searchString}
                className="dr-input text-ellipsis"
                type="text"
                placeholder="Search threads"
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
              <ThreadsFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/>
            </Popover>
          </div>
          <ThreadList
            className={ classes.threads }
            board={ filterBoard(board, threads, board.searchString) }
            layout={ layout }
          />
        </div>
      )
    }

    const getTemplate = () => {
      const numThreads = has(board, 'data.groups') ? getAllThreads(board.data.groups).length : '';
      if(numThreads == 0 && !hideGuide){
        return guideTemplate();
      }
      else if(has(board, 'data.groups')){
        return threadsTemplate();
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

function mapStateToProps({ threads, projects }, {projectId}) {
  const projectBoards = threads.projects[projectId];
  const board = projectBoards && projectBoards.boards ? threads.boards[projectBoards.boards[0]] : {};
  return {
    threads: threads.data,
    project: projects[projectId],
    projectBoards,
    board,
    boardModel: board && board.data && board.data._id ? `threads.boards.${board.data._id}` : '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ThreadsActions: bindActionCreators(ThreadsActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Threads);
