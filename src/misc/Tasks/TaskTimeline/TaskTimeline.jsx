// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../Tasks.actions.js';
import * as CommentsActions from 'stemn-shared/misc/Comments/Comments.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TaskTimeline.css';

// Sub Components
import Comment from 'stemn-shared/misc/Comments/Comment';
import TaskTimelineItem from './TaskTimelineItem/TaskTimelineItem.jsx';
import comments      from 'stemn-shared/assets/images/pure-vectors/comments.svg';

///////////////////////////////// COMPONENT /////////////////////////////////

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
    const { events, entityModel, board, className } = this.props;

    if(events && events.data && events.data.length > 0){
      return (
        <div className={ className } >
          {events.data.map(item => <TaskTimelineItem key={item._id} item={item} board={board} /> )}
        </div>
      )
    }
    else{
     return (
       <div className={ classNames('layout-column layout-align-center-center text-center', className) } style={{height: '100%'}}>
         <img src={comments} style={{width: '80px'}}/>
         <div className="text-title-4" style={{marginBottom: '10px'}}>Task timeline is empty</div>
         <div className="text-title-5">Items will appear here when you commit, <br/>modify or comment on this task.</div>
       </div>
      )
    }
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

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
