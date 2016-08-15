import React from 'react';
import classNames from 'classnames';
import styles from './header.css';

import {MdMenu} from 'react-icons/lib/md';

export default class extends React.Component{
  render() {
    return (
      <div className={styles.toolbar + ' layout-row layout-align-start-center rel-box'}>
        {!this.props.sidebar.show ? <a onClick={()=>{this.props.sidebarActions.toggleSidebar();}}><MdMenu size="25"/></a> : ''}
        <div className={styles.inner + ' layout-row flex'}>{this.props.children}</div>
      </div>
    );
  }
};
