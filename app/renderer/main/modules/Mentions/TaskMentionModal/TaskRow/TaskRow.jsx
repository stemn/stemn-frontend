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

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { task, entityModel } = this.props;

    if(!task){
      return <div>Task Loading</div>
    }
    return (
      <div className={classes.row + ' layout-row layout-align-start-center'}>
        <div style={{marginRight: '10px'}} title="Mark as Complete">
          <Checkbox circle={true} />
        </div>
        <div className="flex text-ellipsis" style={{marginBottom: '2px'}}>{task.title}</div>
        <div className={classes.checkbox} title="Related Task">
          <Checkbox />
        </div>
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
