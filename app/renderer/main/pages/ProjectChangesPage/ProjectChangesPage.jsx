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
import { Link }           from 'react-router';
import ContentSidebar     from 'app/renderer/main/components//ContentSidebar';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import CommitChanges      from 'app/renderer/main/components//CommitChanges';
import CommitBox          from 'app/renderer/main/components/CommitBox/CommitBox.jsx'
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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

  CommitBoxStyles: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'rgba(0, 0, 0, 0.03)'
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
    const { changes, project, ChangesActions } = this.props;

    if(!project || !changes || !project.data){
      return <LoadingOverlay />
    }
    if(project.data.remote.connected){
      const baseLink = `project/${this.props.project.data._id}`;
      const filePrevious = changes.selected.data && changes.selected.data.previousRevisionId ? u( {data: {revisionId : changes.selected.data.previousRevisionId}}, changes.selected) : null;
      return (
        <div className="layout-column flex rel-box">
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar>
                {changes && changes.data
                  ? <CommitChanges changes={changes} project={project.data} actToggleAll={this.toggleAll} selectedFileChange={ChangesActions.selectedFileChange}/>
                  : ''}

                <div style={this.CommitBoxStyles}>
                  <CommitBox changes={changes} changesActions={ChangesActions} commitFn={()=>this.commitFn()} project={project.data}/>
                </div>
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              {changes.selected && changes.selected.data
                ?
                <div className="layout-column flex">
                  <FileCompareHeader
                    compareId={`changes-${project.data._id}-${changes.selected._id}`}
                    file1={changes.selected.data} />
                  <FileCompare
                    compareId={`changes-${project.data._id}-${changes.selected._id}`}
                    project={project.data}
                    file1={changes.selected.data}
                    file2={filePrevious ? filePrevious.data : null} />
                </div>
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
          <div className="text-title-4 text-center">Project not connected to Drive or Dropbox</div>
          <div className="text-title-4 text-center link-primary" style={{marginTop: '10px'}}><Link to={baseLink+'/settings'}>Add File Store</Link></div>
        </div>
      )
    }
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
