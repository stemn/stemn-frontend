import React, { Component, PropTypes } from 'react';

import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';
import TaskLabelsEdit from 'stemn-shared/misc/Tasks/TaskLabelsEdit/TaskLabelsEdit.jsx'
import TaskGroupsEdit from 'stemn-shared/misc/Tasks/TaskGroupsEdit'
import Form from 'stemn-shared/misc/Forms/Form'
import { has } from 'lodash'

export default class TasksSettings extends Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    boardModel: PropTypes.string.isRequired,
    saveBoard: PropTypes.func.isRequired,
  }
  saveBoard = () => {
    const { board, boardModel, saveBoard } = this.props

    // Get the new board data
    // We filter out the empty tasks and groups
    const newBoard = {
      ...board.data,
      groups: board.forms.groups.filter(item => item.name.length > 0 && item.tasks.length > 0),
      labels: board.forms.labels.filter(item => item.name.length > 0 && item.color.length > 0),
    }
    saveBoard({
      board: newBoard,
    })
  }
  render() {
    const { boardModel, board } = this.props;
    return(
      <div>
        <h3>Thread Groups</h3>
        <p>Groups are used to categorize your threads. A thread can only be part of 1 group at any given time. If you delete a group, all child threads will be removed.</p>
        <Form model={ `${boardModel}.forms.groups` } value={ board.data.groups }>
          { has(board, 'forms.groups') && <TaskGroupsEdit model={ `${boardModel}.forms.groups` } value={ board.forms.groups } /> }
        </Form>
        <br />
        <br />
        <h3>Thread Labels</h3>
        <p>Labels act in a similar way to Groups except a thread can have multiple labels. If you delete a label, it will be removed from all related threads.</p>
        <Form model={ `${boardModel}.forms.labels` } value={ board.data.labels }>
          { has(board, 'forms.labels') && <TaskLabelsEdit model={ `${boardModel}.forms.labels` } value={ board.forms.labels } /> }
        </Form>
        <br />
        <div className="layout-row">
          <div className="flex"></div>
          <ProgressButton
            className="primary"
            onClick={ this.saveBoard }
            loading={ board.savePending }>
            Save
          </ProgressButton>
        </div>
      </div>
    );
  }
}
