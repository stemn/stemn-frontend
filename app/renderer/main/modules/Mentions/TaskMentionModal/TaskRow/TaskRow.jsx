// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';
import moment from 'moment';

// Container Actions
import * as TasksActions from 'app/renderer/main/modules/Tasks/Tasks.actions.js';

// Styles
import classNames from 'classnames';
import classes from './TaskRow.css';
import loadingClasses from 'app/shared/modules/Loading/LoadingPlaceholders/LoadingPlaceholders.css'


// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Button from 'app/renderer/main/components/Buttons/Button/Button';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  // Mounting
  onMount (nextProps, prevProps) {
    if(!prevProps || prevProps.taskId != nextProps.taskId){
      nextProps.dispatch(TasksActions.getTask({
        taskId: nextProps.taskId
      }))
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    const { task, entityModel, toggleComplete, toggleRelated, mention } = this.props;

    if(!task && task.data){
      return (
        <div className={classNames(classes.row, loadingClasses.loading, 'layout-row', 'layout-align-start-center')}>
          <div className="flex text-ellipsis" style={{marginBottom: '2px'}}>The task namelongword goes here</div>
          <Button className={classNames('xs', classes.button)} style={{width: '60px'}}>&nbsp;</Button>
          <Button className={classNames('xs', classes.button)} style={{width: '60px'}}>&nbsp;</Button>
        </div>
      )
    }
    return (
      <div className={classes.row + ' layout-row layout-align-start-center'}>
        <div className="flex text-ellipsis" style={{marginBottom: '2px'}}>{task.data.name}</div>
        <Button
           className={classNames('xs', classes.button, {[classes.active] : mention && mention.complete})}
           title="Mark as Complete"
           onClick={toggleComplete}>Complete</Button>
        <Button
           className={classNames('xs', classes.button, {[classes.active] : mention && mention.related})}
           title="Mark as related"
           onClick={toggleRelated}>Related</Button>
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks }, { taskId }) {
  return {
    task: tasks.data[taskId],
    entityModel: `tasks.data[${taskId}]`
  };
}

export default connect(mapStateToProps)(Component);
