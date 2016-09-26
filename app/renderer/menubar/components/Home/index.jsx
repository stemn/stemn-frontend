// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'app/renderer/main/modules/Changes/Changes.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import CommitChanges      from 'app/renderer/main/modules/Changes/CommitChanges/CommitChanges.jsx';
import CommitBox          from 'app/renderer/main/modules/Changes/CommitBox/CommitBox.jsx'
import Toolbar            from 'app/renderer/menubar/containers/Toolbar'
import Sidebar            from 'app/renderer/menubar/modules/Sidebar/Sidebar.jsx'
import * as stringConcat  from 'app/shared/helpers/stringConcat';

export const Component = React.createClass({
  propTypes: {
    project: React.PropTypes.object.isRequired,
  },

  componentWillMount() {
    if(this.props.project && this.props.project.data && this.props.project.data.remote.connected){
      this.props.ChangesActions.fetchChanges({
        projectId: this.props.project.data._id
      })
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.project && nextProps.project && this.props.project.data && nextProps.project.data._id !== this.props.project.data._id && nextProps.project.data.remote.connected) {
      this.props.ChangesActions.fetchChanges({
        projectId: nextProps.project._id
      })
    }
  },

  toggleAll(model, value){
    return this.props.ChangesActions.actToggleAll({
      model,
      value,
      projectId: this.props.project.data._id
    })
  },

  commitFn(){
    this.props.ChangesActions.commit({
      projectId: this.props.project.data._id,
      revisions: this.props.changes.data.filter((item)=>item.selected).map((item)=>item._id),
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },

  render() {
    const { changes, project, ChangesActions, entityModel } = this.props;

    const getInnerContent = () => {
      if(project && project.data.remote.connected){
        return getChangesAndBox();
      }
      else{
        return projectNotConnected()
      }
    }

    const getChangesAndBox = () => {
      if(changes && changes.data){
        const commitBoxStyles = changes.summary && changes.summary.length > 0 ? {
          height: '300px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(0, 0, 0, 0.03)',
          transition: 'height 0.3s ease'
        } : {
          height: '60px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(0, 0, 0, 0.03)',
          transition: 'height 0.3s ease'
        };
        return (
          <div className="layout-column">
            <CommitChanges
              changes={changes}
              project={project.data}
              actToggleAll={this.toggleAll}
              selectedFileChange={ChangesActions.selectedFileChange}/>
            <div style={CommitBoxStyles}>
              <CommitBox
                entityModel={entityModel}
                changes={changes}
                changesActions={ChangesActions}
                commitFn={()=>this.commitFn()}
                project={project.data}/>
            </div>
          </div>
        )
      }
    }

    const projectNotConnected = () => {
      <div className="layout-column layout-align-center-center flex">
        <div className="text-center">Changes not available. Connect this project to Drive or Dropbox</div>
      </div>
    }

    return (
      <div className="layout-column">
        <Toolbar>
         {project && project.data && project.data.name
          ? stringConcat.end(project.data.name, 28)
          : ''}
        </Toolbar>
        {getInnerContent()}
        <LoadingOverlay show={project && project.loading} />
        <Sidebar />
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({changes, projects}, {params}) {
  const project = projects.data[params.stub];
  return {
    project: project,
    changes: changes[params.stub],
    entityModel: `changes.${params.stub}`
  };
}


function mapDispatchToProps(dispatch) {
  return {
    ChangesActions: bindActionCreators(ChangesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
