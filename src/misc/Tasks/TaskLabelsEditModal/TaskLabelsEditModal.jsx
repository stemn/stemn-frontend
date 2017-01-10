// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../Tasks.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { get, has } from 'lodash';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';

// Sub Components
import TaskLabelsEdit from '../TaskLabelsEdit/TaskLabelsEdit.jsx'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    if(has(this.props, 'board.data.labels')){
      this.props.dispatch(actions.load(`${this.props.boardModel}.forms.labels`, this.props.board.data.labels));
    }
  },
  submit() {
    this.props.dispatch(actions.change(`${this.props.boardModel}.data.labels`, this.props.board.forms.labels));
    setTimeout(()=>{
      this.props.tasksActions.updateBoard({board: this.props.board.data}).then( response => {
        this.props.modalHide();
      });
    })
  },
  render() {
    const {
      boardModel, board,
      modalCancel, modalConfirm, modalHide
    } = this.props;

    return (
      <div style={{width: '500px'}}>
        <div className="modal-title">Edit Labels</div>
        <div className="modal-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
          { has(board, 'forms.labels')
          ? <TaskLabelsEdit model={`${boardModel}.forms.labels`} value={board.forms.labels} />
          : null}
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={() => {modalCancel(); modalHide()}}>Cancel</Button>
          <Button className="primary"
            onClick={this.submit}
            loading={board.savePending}
          >Update Labels</Button>
        </div>
      </div>
    )
  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps(state, { boardId }) {
  const boardModel = `tasks.boards.${boardId}`;
  return {
    board: get(state, boardModel), // Get the value from the model
    boardModel
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    tasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
