import React from 'react';
import * as ElectronWindowActions from 'app/shared/electronActions/window.js';

// Styles
import classNames from 'classnames';
import toolbarStyles from './Toolbar.css'

import {MdMenu, MdOpenInNew, MdNotificationsNone} from 'react-icons/lib/md';

export default class extends React.Component{
  render() {
    return (
      <div className={classNames(toolbarStyles.toolbar, 'layout-row layout-align-start-center')}>
        <MdMenu size="22" onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(true)}/>
        <div className={classNames(toolbarStyles.text, 'flex')}>
          {this.props.children}
        </div>
        <MdOpenInNew onClick={()=>ElectronWindowActions.windowMainOpen()} size="22"/>
      </div>
    );
  }
};

//        <MdNotificationsNone onClick={()=>ElectronWindowActions.windowMainOpen()} size="22" style={{marginRight: '10px'}}/>
