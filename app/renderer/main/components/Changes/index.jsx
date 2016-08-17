import React, { Component } from 'react';

import ContentSidebar from '../ContentSidebar';
import Timeline       from '../../containers/Timeline';
import CommitChanges  from '../CommitChanges';
import CommitBox      from 'app/renderer/main/components/CommitBox/CommitBox.jsx'
import PreviewFile    from 'app/renderer/main/containers/PreviewFile';

//import CommitBox from '../CommitBox/CommitBox'


// Styles
import classNames from 'classnames';

export default (props) => {
  const CommitBoxStyles = {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'rgba(0, 0, 0, 0.03)'
  }

  const commitFn = () => {
    console.log(props.model.files);
    this.props.changesActions.commit({
      projectId: props.project._id,
      revisions: ['revisions'],
      summary: props.changes.model.commitSummary,
      description: props.changes.model.commitDescription
    })
  }
//      <Timeline />

  return (
    <div className="layout-column flex rel-box">
      <div className="layout-row flex">
        <div className="layout-column">
          <ContentSidebar>
            <CommitChanges changes={props.changes} actToggleAll={props.changesActions.actToggleAll} selectedFileChange={props.changesActions.selectedFileChange}/>
            <div style={CommitBoxStyles}>
              <CommitBox changes={props.changes} changesActions={props.changesActions} commitFn={commitFn}/>
            </div>
          </ContentSidebar>
        </div>
        <div className="layout-column">
          {/*<h1>{props.changes.model.selectedFile.name}</h1>*/}
          <PreviewFile projectStub="stemn" path="README.md" />
        </div>
      </div>
    </div>
  );
}
