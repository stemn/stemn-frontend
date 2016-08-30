// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'app/shared/actions/changes.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import ContentSidebar from 'app/renderer/main/components//ContentSidebar';
import Timeline       from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import CommitChanges  from 'app/renderer/main/components//CommitChanges';
import CommitBox      from 'app/renderer/main/components/CommitBox/CommitBox.jsx'
import FileCompare    from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import PreviewFile    from 'app/renderer/main/containers/PreviewFile.js';

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    if(this.props.project){
      this.props.ChangesActions.fetchChanges({
        projectId: this.props.project._id
      })
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.project && nextProps.project && nextProps.project._id !== this.props.project._id) {
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
      projectId: this.props.project._id
    })
  },

  commitFn(){
    this.props.ChangesActions.commit({
      projectId: this.props.project._id,
      revisions: this.props.changes.data.filter((item)=>item.selected).map((item)=>item._id),
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },

  render() {
    const props = this.props;
    if(props.changes){
      return (
        <div className="layout-column flex rel-box">
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar>
                {props.changes && props.changes.data
                  ? <CommitChanges changes={props.changes} project={props.project} actToggleAll={this.toggleAll} selectedFileChange={props.ChangesActions.selectedFileChange}/>
                  : ''}

                <div style={this.CommitBoxStyles}>
                  <CommitBox changes={props.changes} changesActions={props.ChangesActions} commitFn={()=>this.commitFn()} project={this.props.project}/>
                </div>
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              {props.changes.selected && props.changes.selected.data
                ?
                <FileCompare file={props.changes.selected.data}>
                  <PreviewFile project={props.project} file={props.changes.selected.data} />
                  <PreviewFile project={props.project} file={props.changes.selected.data} />
                </FileCompare>
                : <div className="layout-column layout-align-center-center">Select a change</div>
              }
            </div>

          </div>
        </div>
      );
    }
    else{
      return null
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
