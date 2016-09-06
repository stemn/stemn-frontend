// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../../Tasks.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskListItem.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  render() {
    const { item, task } = this.props;

    if(!task){
      return <div>Task Loading</div>
    }

    return (
      <div className={classNames(classes.taskListItem, 'layout-row flex layout-align-start-center')}>
        <Checkbox />
        <div className="flex text-ellipsis">{task.title}</div>
        <div className={classes.user + ' layout-row layout-align-start-center text ellipsis'}>
          <UserAvatar picture={task.users[0].picture} size="25px"/>
          <div style={{marginLeft: '10px'}}>{task.users[0].name}</div>
        </div>
        <div className={classes.date + ' text ellipsis'}>
          {moment(task.due).fromNow()}
        </div>
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks }, {item}) {
  console.log(tasks, item);
  return {
    task: tasks.data[item._id],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
