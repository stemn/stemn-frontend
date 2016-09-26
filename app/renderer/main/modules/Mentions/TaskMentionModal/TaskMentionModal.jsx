// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';
import moment from 'moment';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';
import classes from './TaskMentionModal.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import TaskRow from './TaskRow/TaskRow.jsx';
import { MdSearch } from 'react-icons/lib/md';

///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.task){
    if(!prevProps || nextProps.task.project._id !== prevProps.task.project._id){
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},
  submit(){
    this.props.modalConfirm({
      payload: {
        mentions: [{
          entityId: '57c526c3e7c624f857828695',
          display: 'Task 1',
          mentionType: 'task',
          mentionId: '57c526c3e7c624f857828691'
        },{
          entityId: '57c526c3e7c624f857828693',
          display: 'Task 2',
          mentionType: 'task',
          mentionId: '57c526c3e7c624f857828692'
        }]
      }
    });
    this.props.modalHide();
  },
  cancel(){
    this.props.modalCancel();
    this.props.modalHide();
  },

  toggle({type, taskId, mention}){
    // type == 'complete' || 'related'
    const toggleField = (type1, type2) => {
      const value = mention ? !mention[type1] : true;
      if(value){
        this.props.dispatch(actions.change(`${this.props.mentionsModel}.${taskId}.${type1}`, value))
        this.props.dispatch(actions.change(`${this.props.mentionsModel}.${taskId}.${type2}`, !value))
      }
      else{
        this.props.dispatch(actions.change(`${this.props.mentionsModel}.${taskId}.${type1}`, value))
      }
    }
    return type == 'complete' ? toggleField('complete', 'related') : toggleField('related', 'complete');
  },

  render() {
    const { tasks, mentions } = this.props;
    if(!tasks){
      return <div>Loading</div>
    }

    const numComplete = filterMentions(mentions, 'complete').length;
    const numRelated = filterMentions(mentions, 'related').length;

    let summaryString = numComplete > 0 ? `${numComplete} completed` : '';
    summaryString += (numComplete > 0 && numRelated > 0) ? ` and ` : '';
    summaryString += numRelated > 0 ? `${numRelated} related` : '';
    summaryString += (numComplete > 0 || numRelated > 0) ? ` task${(numRelated > 1 || (numRelated == 0 && numComplete > 1)) ? 's' : ''}.` : '';

    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">
          Add tasks to a commit:
        </div>
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{summaryString}</div>
          <div className={classes.search}>
            <input className="dr-input" placeholder="Search tasks"/>
            <MdSearch size="20"/>
          </div>
        </div>
        <div className="flex scroll-box">
          {Object.keys(tasks).map((taskId) => <TaskRow
          key={taskId}
          taskId={taskId}
          mention={mentions[taskId]}
          toggleComplete={()=>this.toggle({
            type: 'complete',
            taskId,
            mention: mentions[taskId],
          })}
          toggleRelated={()=>this.toggle({
            type: 'related',
            taskId,
            mention: mentions[taskId],
          })}
          />)}
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-description-1"></div>
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>Cancel</Button>
          <Button className="primary" onClick={this.submit}>Add Tasks</Button>
        </div>
      </div>
    )
  }
});


function filterMentions(mentions, type){
  const mentionsArray = mentions ? Object.keys(mentions).map(taskId => mentions[taskId]) : [];
  // type == 'complete' || 'related'
  return mentionsArray.length > 0 ? mentionsArray.filter( mention => mention[type]) : []
}


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks, mentions}, {projectId}) {
  return {
    tasks: tasks.data,
    mentionsModel: `mentions.tasks.gooba`,
    mentions: mentions.tasks.gooba || {}
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
