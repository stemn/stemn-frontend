// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from 'app/renderer/main/modules/Tasks/Tasks.actions.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';

import u from 'updeep';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import TaskList       from 'app/renderer/main/modules/Tasks/TaskList/TaskList.jsx'
import TaskGrid       from 'app/renderer/main/modules/Tasks/TaskGrid/TaskGrid.jsx'

import TaskDisplayModal from 'app/renderer/main/modules/Tasks/TaskDisplayModal/TaskDisplayModal.jsx'
import Modal from 'app/renderer/main/modules/Modal/Modal.jsx'



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({

  componentWillMount() {
    if(this.props.project){
      this.props.TasksActions.getTasks({
        projectId: this.props.project.data._id
      })
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.project && nextProps.project._id !== this.props.project._id) {
      this.props.TasksActions.getTasks({
        projectId: nextProps.project.data._id
      })
    }
  },

  render() {
    const { tasks, project, TasksActions, entityModel } = this.props;
    if(tasks && tasks.structure){
      return (
        <div className="layout-column flex">
          <TaskGrid project={project.data}></TaskGrid>
        </div>
      )
    }
    else{
      return <LoadingOverlay />
    }
  }
});

//          <Modal modalId="TaskDisplay" width="1000px">
//            <button>POP IT BABY</button>
//            <TaskDisplayModal
//              item={{_id: 'T4'}}
//            />
//          </Modal>

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks, projects}, {params}) {
  const project = projects[params.stub];
  return {
    project: project,
    tasks: tasks.projects[params.stub],
    entityModel: `projects.${params.stub}`
  };
}


function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions: bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
