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
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const layouts = [{
  text: 'Layout: List',
  value: 'list'
},{
  text: 'Layout: Board',
  value: 'board'
}];

const statusFilter = [{
  text: 'Status: Complete',
  value: 'complete'
},{
  text: 'Status: Incomplete',
  value: 'incomplete'
},{
  text: 'Status: All',
  value: 'all'
}];

const ownerFilter = [{
  text: 'My Tasks',
  value: 'myTasks'
},{
  text: 'All Tasks',
  value: 'allTasks'
}];

export const Component = React.createClass({
  componentWillMount() {
    this.props.TasksActions.getTasks({
      projectId: this.props.projectId
    })
  },
  getInitialState () {
    return {
      layout: 'list',
    }
  },
  setLayout (layout) {
    // layout = 'board' || 'list'
    this.setState({ layout: layout })
  },
  render() {
    const { tasks, project } = this.props;

    const pageStyle = this.state.layout == 'board' ? {background: 'rgba(0, 0, 0, 0.02)', padding: '30px'} : {background: 'white', padding: '30px'};

    if(!tasks || !tasks.structure){
      return null
    }

    return (
      <div className="layout-column flex" style={pageStyle}>
       <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className={classes.search}>
            <Field model="sidebar.searchString">
              <input className="dr-input text-ellipsis" type="text" placeholder="Search tasks"/>
            </Field>
            <MdSearch size="25"/>
          </div>
          <div className="flex"></div>
          <PopoverMenu preferPlace="below">
            <Button style={{marginLeft: '10px'}} className="light">Layout</Button>
            <div className="PopoverMenu">
              {layouts.map(layout =>
               <a className={classNames({'active' : this.state.layout == layout.value})} onClick={()=>this.setLayout(layout.value)}>{layout.text}</a>
              )}
            </div>
          </PopoverMenu>
          <PopoverMenu preferPlace="below">
            <Button style={{marginLeft: '10px'}} className="light">Filter</Button>
            <div className="PopoverMenu">
              {statusFilter.map(item =>
               <a className={classNames({'active' : this.state.layout == item.value})} onClick={()=>this.setLayout(item.value)}>{item.text}</a>
              )}
              <div className="divider"></div>
              {ownerFilter.map(item =>
               <a className={classNames({'active' : this.state.layout == item.value})} onClick={()=>this.setLayout(item.value)}>{item.text}</a>
              )}
            </div>
          </PopoverMenu>
          <Button style={{marginLeft: '10px'}} className="primary">New Task</Button>
        </div>
        <TaskList structure={tasks.structure} project={project} layout={this.state.layout}/>
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks, projects }, {projectId}) {
  return {
    tasks: tasks.projects[projectId],
    project: projects[projectId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
