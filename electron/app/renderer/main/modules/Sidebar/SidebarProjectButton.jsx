import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import styles from './SidebarProjectButton.css';
import book   from 'app/renderer/assets/images/pure-vectors/book.svg';
import tutorial   from 'app/renderer/assets/images/pure-vectors/monitor-click.svg';

export default (props) => {
  const iconStyle = {width: '22px', height: '22px'};
  const inner = (
    <div className="layout-row layout-align-start-center">
      <img src={props.icon == 'tutorial' ? tutorial : book} style={iconStyle}/>
      <div className={styles.text + ' flex'}>{props.item.name}</div>
    </div>
  );
  if(props.to){
    return (
      <Link className={classNames(styles.sidebarButton)} activeClassName="active" key={props.key} to={props.to} onClick={()=>{if(props.clickFn){props.clickFn()}}}>
        {inner}
      </Link>
    );
  }
  else{
    return (
      <a className={classNames(styles.sidebarButton)} key={props.key} onClick={()=>{if(props.clickFn){props.clickFn()}}}>
        {inner}
      </a>
    )
  }
};
