import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import styles from './SidebarProjectButton.css';

import {GoRepo} from 'react-icons/lib/go';

export default (props) => {
  return (
    <Link className={classNames(styles.sidebarButton)} activeClassName="active" key={props.item._id} to={props.to} onClick={()=>{if(props.clickFn){props.clickFn()}}}>
      <div className="layout-row layout-align-start-center">
        <GoRepo size="15"/>
        <div className={styles.text + ' flex'}>{props.item.name}</div>
      </div>
    </Link>
  );
};
