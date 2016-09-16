// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';
import moment from 'moment';
// Styles
import classNames from 'classnames';
import classes from './TaskCommitRow.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
//import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'
//import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
//import { MdMoreHoriz, MdOpenInNew } from 'react-icons/lib/md';
//import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
//import TaskLabelDots from 'app/renderer/main/modules/Tasks/TaskLabelDots/TaskLabelDots.jsx'
//import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
//import UserSelect from 'app/renderer/main/components/Users/UserSelect/UserSelect.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////


export const Component = React.createClass({
  render() {
    const { task, entityModel } = this.props;

    if(!task){
      return <div>Task Loading</div>
    }
    return (
      <div className={classes.row + ' layout-row layout-align-start-center'}>
        <div style={{marginRight: '10px'}}>
          <Checkbox circle={true} />
        </div>
        <div className="flex text-ellipsis" style={{marginBottom: '2px'}}>{task.title}</div>
        <div className={classes.checkbox}>
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

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
