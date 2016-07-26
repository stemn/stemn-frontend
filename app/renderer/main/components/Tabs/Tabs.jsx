import React, { Component } from 'react';

import tabClasses from './Tabs.css';


// Styles
import classNames from 'classnames';

export default (props) => {

  return (
    <div className={tabClasses.tabs}>
      <div className={classNames('tabs-inner', 'flex', 'layout-row', tabClasses.inner)}>
        {props.children}
      </div>
    </div>
  );
}

//      <div class="overflow-arrow overflow-arrow-left" layout="column" layout-align="center">
//          <md-icon md-svg-icon="chevron-left"></md-icon>
//      </div>
//      <div class="overflow-arrow overflow-arrow-right" layout="column" layout-align="center">
//          <md-icon md-svg-icon="chevron-right"></md-icon>
//      </div>
