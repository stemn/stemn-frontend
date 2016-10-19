// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'app/renderer/main/modules/Changes/Changes.actions.js';

// Component Core
import React from 'react';

import i from 'icepick';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';

// Sub Components
import { Link }             from 'react-router';
import ContentSidebar       from 'app/renderer/main/components/ContentSidebar';
import LoadingOverlay       from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Timeline             from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import CommitChanges        from 'app/renderer/main/modules/Changes/CommitChanges/CommitChanges.jsx';
import CommitBox            from 'app/renderer/main/modules/Changes/CommitBox/CommitBox.jsx'
import FileCompareStandard  from 'app/renderer/main/modules/FileCompare/FileCompareStandard/FileCompareStandard.jsx';
import cloudLocked          from 'app/renderer/assets/images/pure-vectors/cloud-locked.svg';


///////////////////////////////// COMPONENT /////////////////////////////////

const CommitBoxStyles = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(0, 0, 0, 0.03)'
};

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
        projectId: nextProps.project.data._id
      })
    }
  },

  refresh(){
    this.props.ChangesActions.fetchChanges({
      projectId: this.props.project.data._id
    })
  },

  toggleAll(value){
    return this.props.ChangesActions.toggleAll({
      value,
      projectId: this.props.project.data._id
    })
  },

  commitFn(){
    this.props.ChangesActions.commit({
      projectId: this.props.project.data._id,
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },

  render() {
    const { changes, project, ChangesActions, entityModel, dispatch } = this.props;

    if(!project || !project.data){
      return <LoadingOverlay />
    }

    const baseLink = `project/${project.data._id}`;

    if(project.data.remote.connected){
      if(!changes){
        return <LoadingOverlay />
      }
      const filePrevious = has(changes, 'selected.data.previousRevisionId')
        ? i.assocIn(changes.selected.data, ['revisionId'], changes.selected.data.previousRevisionId)
        : null;

      return (
        <div className="layout-column flex rel-box">
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar>
                {changes && changes.data
                  ? <CommitChanges
                      changes={changes}
                      project={project.data}
                      toggleAll={this.toggleAll}
                      selectedFileChange={ChangesActions.selectedFileChange}
                      refresh={this.refresh}
                      dispatch={dispatch}
                    />
                  : ''}

                <div style={CommitBoxStyles}>
                  <CommitBox
                    entityModel={entityModel}
                    changes={changes}
                    changesActions={ChangesActions}
                    commitFn={()=>this.commitFn()}
                    project={project.data}
                  />
                </div>
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              {changes.selected && changes.selected.data
                ?
                <FileCompareStandard
                  compareId={`changes-${project.data._id}-${changes.selected._id}`}
                  project={project.data}
                  file1={changes.selected.data}
                  file2={filePrevious} />
                : <div className="layout-column layout-align-center-center flex text-title-4 text-center">No file change selected.</div>
              }
            </div>

          </div>
        </div>
      );
    }
    else{
      return (
        <div className="layout-column layout-align-center-center flex">
          <img src={cloudLocked}/>
          <div className="text-title-4 text-center">Changes not available. Connect this project to Drive or Dropbox</div>
          <div className="text-title-4 text-center link-primary" style={{marginTop: '10px'}}><Link to={baseLink+'/settings'}>Add File Store</Link></div>
        </div>
      )
    }
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
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
