// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../Tasks.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskDisplayModal.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import LabelSelect from './LabelSelect/LabelSelect.jsx';
import UserSelect from 'app/renderer/main/components/Users/UserSelect/UserSelect.jsx';
import TaskTimeline from '../TaskTimeline/TaskTimeline.jsx';
import DatePicker from 'app/renderer/main/modules/Calendar/DatePicker/DatePicker.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.item){
    if(!prevProps || nextProps.item._id !== prevProps.item._id){
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  render() {
    const { item, task, entityModel, modalCancel, modalHide } = this.props;

    if(!task){
      return <div>Task Loading</div>
    }

    return (
      <div className={classNames(classes.taskDisplayModal)}>
        <div className="text-title-4">{task.title}</div>
        <div className="text-grey-3" style={{padding: '10px 0 20px'}}>Opened {moment(task.due).fromNow()} <b className="text-interpunct"></b> By <a className="link-primary">{task.users[0].name}</a> <b className="text-interpunct"></b> 4 Comments</div>
        <div className="layout-row">
          <div className="flex-70" style={{paddingRight: '15px'}}>
            <div className="scroll-box" style={{maxHeight: '500px', paddingRight: '15px', borderTop: '1px solid rgba(0, 0, 0, 0.1)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}>
              <TaskTimeline item={item} />
            </div>
          </div>
          <div className="flex">
            <div className={classes.well}>
              <div className="text-mini-caps" style={{padding: '15px 15px 5px'}}>Labels</div>
              <LabelSelect model={`${entityModel}.labels`}/>
            </div>
            <div className={classes.well}>
              <div className="text-mini-caps" style={{padding: '15px 15px 0'}}>Asignee</div>
              <div style={{padding: '15px'}}>
                <UserSelect model={`${entityModel}.asignee`} value={task.asignee}/>
              </div>
            </div>
            <div className={classes.well}>
              <div className="text-mini-caps" style={{padding: '15px 15px 0'}}>Due Date</div>
              <div style={{padding: '15px'}}>
                <DatePicker  model={`${entityModel}.due`} value={task.due} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks }, {item}) {
  return {
    task: tasks.data[item._id],
    entityModel: `tasks.data.${item._id}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
