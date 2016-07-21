import React, { Component } from 'react';

import ContentSidebar from '../ContentSidebar';
import Timeline       from '../Timeline/Timeline';
import CommitChanges  from '../CommitChanges';
import CommitBox from '../CommitBox/CommitBox'


// Styles
import classNames from 'classnames';

export default (props) => {
  const styles = {
      padding: '30px'
  }
  return (
    <div className="layout-column flex rel-box">
      <Timeline />
      <div className="layout-row flex">
        <div className="layout-column">
          <ContentSidebar>
            <CommitChanges changes={props.changes} actToggleAll={props.actToggleAll} selectedFileChange={props.selectedFileChange}/>
            <CommitBox changes={props.changes}/>
          </ContentSidebar>
        </div>
        <div className="layout-column">
          <h1>{props.changes.model.selectedFile.name}</h1>
        </div>
      </div>
    </div>
  );
}



//      <Timeline />
//      <div className="layout-row flex">
//        <div className="layout-column">
//          <ContentSidebar>
//            <CommitChanges/>
//          </ContentSidebar>
//        </div>
//        <div className="layout-column">
//          <h1>{props.selectedFile.name}</h1>
//        </div>
//      </div>
