import React, { Component } from 'react';

import ContentSidebar from '../ContentSidebar';
import Timeline       from '../../containers/Timeline';
import CommitChanges  from '../CommitChanges';
import CommitBox      from 'app/renderer/main/components/CommitBox/CommitBox.jsx'
//import CommitBox from '../CommitBox/CommitBox'


// Styles
import classNames from 'classnames';

export default (props) => {
  const CommitBoxStyles = {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'rgba(0, 0, 0, 0.03)'
  }

  return (
    <div className="layout-column flex rel-box">
      <Timeline />
      <div className="layout-row flex">
        <div className="layout-column">
          <ContentSidebar>
            <CommitChanges changes={props.changes} actToggleAll={props.actToggleAll} selectedFileChange={props.selectedFileChange}/>
            <div style={CommitBoxStyles}>
              <CommitBox changes={props.changes}/>
            </div>
          </ContentSidebar>
        </div>
        <div className="layout-column">
          <h1>{props.changes.model.selectedFile.name}</h1>
        </div>
      </div>
    </div>
  );
}
