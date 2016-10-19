import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import styles from './SidebarProjectButton.css';
import book   from 'app/renderer/assets/images/pure-vectors/book.svg';

export default (props) => {
  const iconStyle = {width: '20px', height: '20px'};
  return (
    <Link className={classNames(styles.sidebarButton)} activeClassName="active" key={props.item._id} to={props.to} onClick={()=>{if(props.clickFn){props.clickFn()}}}>
      <div className="layout-row layout-align-start-center">
        <img src={book} style={iconStyle}/>
        <div className={styles.text + ' flex'}>{props.item.name}</div>
      </div>
    </Link>
  );
};
