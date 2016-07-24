import React, { Component } from 'react';

import ContentSidebar   from '../../components/ContentSidebar';
import Timeline         from '../../components/Timeline/Timeline';
//import SidebarTimeline  from 'app/modules/files/SidebarTimeline/SidebarTimeline.container.js';

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
          <ContentSidebar className="flex">

          </ContentSidebar>
        </div>
        <div className="layout-column">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod sint fugiat excepturi, quis corrupti ad, numquam aspernatur nostrum ipsam adipisci incidunt dolorem tempora hic magnam neque iste nihil necessitatibus, sapiente.
        </div>
      </div>
    </div>
  );
}

//SidebarTimeline
