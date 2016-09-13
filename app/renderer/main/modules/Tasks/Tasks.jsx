// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from './Tasks.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Tasks.css';

// Sub Components
import { Field } from 'react-redux-form';
import TaskList from './TaskList/TaskList.jsx';
import Button from 'app/renderer/main/components/Buttons/Button/Button'
import { MdSearch } from 'react-icons/lib/md';


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
      <div>
       <div className={classes.header + ' layout-row'}>
          <div className={classes.search}>
            <Field model="sidebar.searchString">
              <input className="dr-input text-ellipsis" type="text" placeholder="Search tasks"/>
            </Field>
            <MdSearch size="25"/>
          </div>
          <div className="flex"></div>
          <Button style={{marginLeft: '10px'}} className="light">Layout</Button>
          <Button style={{marginLeft: '10px'}} className="light">Filter</Button>
          <Button style={{marginLeft: '10px'}} className="primary">New Task</Button>
        </div>
        <TaskList structure={structure} />
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks }, {item}) {
  return {
    tasks: tasks['fakeprojectidhere']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
