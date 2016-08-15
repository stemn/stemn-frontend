import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import styles from './SidebarProjectButton.css';

import {GoRepo} from 'react-icons/lib/go';

export default (props) => {
  return (
    <Link className={classNames(styles.sidebarButton, {[styles.active] : props.isActive} )} key={props.item._id} to={`/project/${props.item.stub}/changes`}>
      <div className="layout-row layout-align-start-center">
        <GoRepo size="15"/>
        <div className={styles.text + ' flex'}>{props.item.name}</div>
      </div>
    </Link>
  );
};
