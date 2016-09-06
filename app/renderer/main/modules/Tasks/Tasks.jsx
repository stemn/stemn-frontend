// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from './Tasks.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import TaskList from './TaskList/TaskList.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  componentWillMount() {
    this.props.TasksActions.getTasks({
      projectId: 'fakeprojectidhere'
    })
  },

  render() {
    const structure = [
      {
        _id: 'G1',
        name: 'Today',
        children: [{_id: 'T1'}, {_id: 'T2'}, {_id: 'T3'}, {_id: 'T4'}]
      },{
        _id: 'G2',
        name: 'Upcoming',
        children: [{_id: 'T5'}, {_id:'T6'}, {_id: 'T7'}]
      },{
        _id: 'G3',
        name: 'Other',
        children: [{_id: 'T8'}, {_id: 'T9'}]
      }
    ]
    return (
      <TaskList structure={structure} />
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks }, {item}) {
  return {
    tasks: tasks
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
