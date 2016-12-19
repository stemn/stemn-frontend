// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as TasksActions    from 'app/renderer/main/modules/Tasks/Tasks.actions.js';

// Component Core
import React, { PropTypes } from 'react';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { actions } from 'react-redux-form';

import ProgressButton from 'app/renderer/main/components/Buttons/ProgressButton/ProgressButton'
import TaskLabelsEdit from 'app/renderer/main/modules/Tasks/TaskLabelsEdit/TaskLabelsEdit.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

const TasksPanel = React.createClass({
  onMount(nextProps, prevProps){
    if(!prevProps || nextProps.board.data._id !== prevProps.board.data._id){
      nextProps.dispatch(
        actions.load(`${nextProps.boardModel}.forms.labels`, nextProps.board.data.labels)
      )
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  submit(){
    // Merge props back to the main data
    this.props.dispatch(
      actions.change(`${this.props.boardModel}.data.labels`, this.props.board.forms.labels)
    );
    // Save the board
    setTimeout(()=>{
      this.props.tasksActions.updateBoard({
        board: this.props.board.data
      })
    }, 1)
  },
  render() {
    const { boardModel, board } = this.props;
    if(has(board, 'forms.labels')){
      return(
        <div className={classes.panel}>
          <h3>Task Labels</h3>
          <p>Labels are used to categorize tasks. If you delete a label, it will be removed from all assigned tasks.</p>
          <TaskLabelsEdit model={`${boardModel}.forms.labels`} value={board.forms.labels} />
          <br />
          <div className="layout-row">
            <div className="flex"></div>
            <ProgressButton
              className="primary"
              onClick={this.submit}
              loading={board.savePending}>
              Save Labels
            </ProgressButton>
          </div>
        </div>
      );
    }
    else{
      return null
    }
  }

});

export const Component = React.createClass({
  onMount(nextProps, prevProps){
    if(!prevProps || nextProps.projectId !== prevProps.projectId){
      nextProps.tasksActions.getBoards({
        projectId: nextProps.projectId
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    const { boardModel, board, dispatch, tasksActions } = this.props;
    return (
      <div>
       { has(board, 'data.labels')
       ? <TasksPanel
           boardModel={boardModel}
           board={board}
           dispatch={dispatch}
           tasksActions={tasksActions}
         />
       : null }
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({tasks, projects}, {params}) {
  const projectId = params.stub;
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  const boardModel = projectBoards ? `tasks.boards.${projectBoards[0]}` : '';
  return {
    projectId,
    board,
    boardModel,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    tasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
