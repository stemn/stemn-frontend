// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';
import moment from 'moment';
// Styles
import classNames from 'classnames';
import classes from './TaskRow.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Button from 'app/renderer/main/components/Buttons/Button/Button';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { task, entityModel, toggleComplete, toggleRelated, mention } = this.props;

    if(!task){
      return <div>Task Loading</div>
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

//        <div style={{marginRight: '10px'}} title="Mark as Complete">
//          <Checkbox circle={true} model={`${entityModel}.data.complete`} value={task.data.complete}/>
//        </div>
//        <div className={classes.checkbox} title="Related Task">
//          <Checkbox />
//        </div>
///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks }, { taskId }) {
  return {
    task: tasks.data[taskId],
    entityModel: `tasks.data[${taskId}]`
  };
}

export default connect(mapStateToProps)(Component);
