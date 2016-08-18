import React, { Component } from 'react';

import ContentSidebar from '../ContentSidebar';
import Timeline       from '../../containers/Timeline';
import CommitChanges  from '../CommitChanges';
import CommitBox      from 'app/renderer/main/components/CommitBox/CommitBox.jsx'
import PreviewFile    from 'app/renderer/main/containers/PreviewFile';

//import CommitBox from '../CommitBox/CommitBox'


// Styles
import classNames from 'classnames';


export default React.createClass({

  componentWillMount() {
    if(this.props.project){
      this.props.changesActions.fetchChanges({stub: this.props.project._id})
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.project._id !== this.props.project._id) {
      this.props.changesActions.fetchChanges({stub: nextProps.project._id})
    }
  },

  CommitBoxStyles: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'rgba(0, 0, 0, 0.03)'
  },

  commitFn(){
    this.props.changesActions.commit({
      projectId: this.props.project._id,
      revisions: ['revisions'],
      summary: this.props.changes.model.commitSummary,
      description: this.props.changes.model.commitDescription
    })
  },

  render() {
    const props = this.props;
    return (
      <div className="layout-column flex rel-box">
        <div className="layout-row flex">
          <div className="layout-column">
            <ContentSidebar>
              {props.changes && props.changes.data ? <CommitChanges changes={props.changes} actToggleAll={props.changesActions.actToggleAll} selectedFileChange={props.changesActions.selectedFileChange}/> : ''}
            </ContentSidebar>
          </div>

        </div>
      </div>
    );
  }
})
//
//              <div style={this.CommitBoxStyles}>
//                <CommitBox changes={props.changes} changesActions={props.changesActions} commitFn={()=>this.commitFn()}/>
//              </div>

//          <div className="layout-column">
//            <PreviewFile projectStub="stemn" path="README.md" />
//          </div>
