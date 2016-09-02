// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'app/shared/actions/changes.js';

// Component Core
import React from 'react';

import u from 'updeep';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import TaskList       from 'app/renderer/main/modules/Tasks/TaskList/TaskList.jsx'
import TaskGrid       from 'app/renderer/main/modules/Tasks/TaskGrid/TaskGrid.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillReceiveProps(nextProps) {
//    if (this.props.project && nextProps.project && nextProps.project._id !== this.props.project._id && nextProps.project.remote.connected) {
//      this.props.ChangesActions.fetchChanges({
//        projectId: nextProps.project._id
//      })
//    }
  },

  render() {
    const { changes, project, ChangesActions } = this.props;

    const groups = ['Requirements', 'Development', 'Design']
    const tasks = [
      {
        _id: '1',
        title : 'Call Joan to discuss existing requirements',
        group: 'Requirements',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '2',
        title : 'Write new requirements based on feedback received from Sam',
        group: 'Requirements',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '3',
        title : 'Create process flow based on user interview',
        group: 'Requirements',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '4',
        title : 'Schedule meeting with client to go over documents from last week',
        group: 'Requirements',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '5',
        title : 'Enable password recovery feature on the application',
        group: 'Development',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '6',
        title : 'Create a build script to concatenate all javascript files for production',
        group: 'Development',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '7',
        title : 'Add feature X to module Y',
        group: 'Development',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '8',
        title : 'Talk to client about changing the look of the header',
        group: 'Design',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }, {
        _id: '9',
        title : 'Get the new designs from Sam',
        group: 'Design',
        due: 1472792461569,
        users : [
          {
            name: 'David Revay',
            picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
          }
        ]
      }
    ]
    return (
      <div className="layout-row flex">
        <TaskGrid tasks={tasks} groups={groups}></TaskGrid>
      </div>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({changes, projects}, {params}) {
  const project = projects[params.stub];
  return {
    project: project,
    changes: changes[params.stub],
  };
}


function mapDispatchToProps(dispatch) {
  return {
    ChangesActions: bindActionCreators(ChangesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
