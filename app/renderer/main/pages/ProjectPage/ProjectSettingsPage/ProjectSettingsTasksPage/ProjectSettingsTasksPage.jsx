// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as TasksActions    from 'app/renderer/main/modules/Tasks/Tasks.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { Field, actions } from 'react-redux-form';

import Button from 'app/renderer/main/components/Buttons/Button/Button'
import TaskLabelsEdit from 'app/renderer/main/modules/Tasks/TaskLabelsEdit/TaskLabelsEdit.jsx'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(!prevProps || nextProps.projectId !== prevProps.projectId){
    // Get the board
    nextProps.tasksActions.getBoard({
      projectId: nextProps.projectId
    })
    // Init the TaskSettings object
    nextProps.dispatch(
      actions.load(`${nextProps.boardModel}.forms.labels`, nextProps.board.data.labels)
    )
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

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
    const { boardModel, board, ProjectsActions, dispatch } = this.props;

    if(!board || !board.forms) {
      return <div>Loading</div>
    }
    return (
      <div className={classes.panel}>
        <h3>Task Label Settings</h3>
        <p>Labels are used to classify tasks. If you delete a label, it will be removed from all existing tasks.</p>
        <TaskLabelsEdit model={`${boardModel}.forms.labels`} value={board.forms.labels} />
        <br />
        <div className="layout-row">
          <div className="flex"></div>
          <Button
            className="primary"
            onClick={this.submit}
            loading={board.savePending}>
            Save Labels
          </Button>
        </div>
      </div>
    );
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
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
    tasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
