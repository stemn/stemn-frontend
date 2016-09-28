import React from 'react';

// Styles
import classNames from 'classnames';
import toolbarStyles from './Toolbar.css'

export default class extends React.Component{
  render() {
    return (
      <div className={classNames(toolbarStyles.toolbar, 'layout-row layout-align-start-center')}>
        {this.props.children}
      </div>
    );
  }
};

//        <MdNotificationsNone onClick={()=>ElectronWindowActions.windowMainOpen()} size="22" style={{marginRight: '10px'}}/>
