// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../Tasks.actions.js';
import * as CommentsActions from 'app/renderer/main/modules/Comments/Comments.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TaskTimeline.css';

// Sub Components
import Comment from 'app/renderer/main/modules/Comments/Comment/Comment.jsx';
import TaskTimelineItem from './TaskTimelineItem/TaskTimelineItem.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.taskId){
    if(!prevProps || nextProps.taskId !== prevProps.taskId){
      nextProps.tasksActions.getEvents({taskId: nextProps.taskId})
    }
  }
}



export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  render() {
    const { events, entityModel, board } = this.props;
    return (
      <div>
        {events && events.data ? events.data.map(item =>
          <TaskTimelineItem key={item._id} item={item} board={board} />
        ) : ''}
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks }, { taskId, board }) {
  return {
    events: tasks.events[taskId],
    entityModel: `tasks.events.${taskId}`,
    board
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tasksActions: bindActionCreators(TasksActions, dispatch),
    commentsActions: bindActionCreators(CommentsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

//const taskEvents = [{
//  event: 'commit',
//  timestamp: 1473254921922,
//  user: {
//    name: 'David Revay',
//    picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg',
//  }
//},{
//  event: 'open',
//  timestamp: 1473254921922,
//  user: {
//    name: 'David Revay',
//    picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg',
//  }
//},{
//  event: 'closed',
//  timestamp: 1473254921922,
//  user: {
//    name: 'David Revay',
//    picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg',
//  }
//},{
//  event: 'changeLabels',
//  timestamp: 1473254921922,
//  added: ['gooba', 'tooba'],
//  user: {
//    name: 'David Revay',
//    picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg',
//  }
//},{
//  event: 'changeLabels',
//  timestamp: 1473254921922,
//  added: ['testy', 'boon'],
//  removed: ['gooba'],
//  user: {
//    name: 'David Revay',
//    picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg',
//  }
//}]
