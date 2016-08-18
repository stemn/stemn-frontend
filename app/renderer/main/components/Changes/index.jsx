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
      this.props.changesActions.fetchChanges({projectId: this.props.project._id})
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.project._id !== this.props.project._id) {
      this.props.changesActions.fetchChanges({projectId: nextProps.project._id})
    }
  },

  CommitBoxStyles: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'rgba(0, 0, 0, 0.03)'
  },

  toggleAll(model, value){
    return this.props.changesActions.actToggleAll({
      model,
      value,
      projectId: this.props.project._id
    })
  },

  commitFn(){
    this.props.changesActions.commit({
      projectId: this.props.project._id,
      revisions: this.props.changes.data.filter((item)=>item.selected).map((item)=>item._id),
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },

  render() {
    const props = this.props;
    return (
      <div className="layout-column flex rel-box">
        <div className="layout-row flex">
          <div className="layout-column">
            <ContentSidebar>
              {props.changes && props.changes.data ? <CommitChanges changes={props.changes} project={props.project} actToggleAll={this.toggleAll} selectedFileChange={props.changesActions.selectedFileChange}/> : ''}

              <div style={this.CommitBoxStyles}>
                <CommitBox changes={props.changes} changesActions={props.changesActions} commitFn={()=>this.commitFn()} project={this.props.project}/>
              </div>
            </ContentSidebar>
          </div>
          <div className="layout-column">
            <PreviewFile projectStub="stemn" path="README.md" />
          </div>

        </div>
      </div>
    );
  }
});

