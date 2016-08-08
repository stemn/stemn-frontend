import React, { Component } from 'react';
import Popover   from '../../../assets/other/react-popup';

import ContentSidebar   from '../../components/ContentSidebar';
import Timeline         from '../../containers/Timeline';
import SidebarTimeline  from '../../containers/SidebarTimeline';

// Styles
import classNames from 'classnames';

export default (props) => {
  const styles = {
      padding: '30px'
  }
  console.log(props.feed.selected);
  return (
    <div className="layout-column flex rel-box">
      <Timeline />
      <div className="layout-row flex">
        <div className="layout-column">
          <ContentSidebar className="flex">
            <SidebarTimeline />
          </ContentSidebar>
        </div>
        <div className="layout-column">
          {props.feed.selected._id}
        </div>
      </div>
    </div>
  );
}
