import React from 'react';

// Styles
import classNames from 'classnames';
import toolbarStyles from './Toolbar.css'

import {MdMenu, MdOpenInNew} from 'react-icons/lib/md';

export default class extends React.Component{
  render() {
    return (
      <div className={classNames(toolbarStyles.toolbar, 'layout-row layout-align-start-center')}>
        <MdMenu size="20" onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(true)}/>
        <div className={classNames(toolbarStyles.text, 'flex')}>
          {this.props.children}
        </div>
        <MdOpenInNew size="20"/>
      </div>
    );
  }
};
