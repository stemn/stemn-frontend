import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import styles from './SidebarProjectButton.css';
import book   from 'stemn-shared/assets/images/pure-vectors/book.svg';
import tutorial   from 'stemn-shared/assets/images/pure-vectors/monitor-click.svg';
import Drive   from 'stemn-shared/assets/icons/providers/drive.js';
import Dropbox   from 'stemn-shared/assets/icons/providers/dropbox.js';

export default (props) => {
  const iconStyle = {width: '22px', height: '22px'};
  const { item, key, to, clickFn, icon } = props;

  const getIcon = (provider) => {
    if(provider == 'dropbox'){
      return <Dropbox size={14}/>
    }
    else if(provider == 'drive'){
      return <Drive size={14}/>
    }
    else{
      return <img src={icon == 'tutorial' ? tutorial : book} style={iconStyle}/>
    }
  }

  const inner = (
    <div className="layout-row layout-align-start-center">
      <div style={iconStyle} className="layout-column layout-align-center-center">{getIcon(item.remote ? item.remote.provider : '')}</div>
      <div className={styles.text + ' flex'}>{item.name}</div>
    </div>
  );
  if(to){
    return (
      <Link className={classNames(styles.sidebarButton)} activeClassName="active" key={key} to={to} onClick={()=>{if(clickFn){clickFn()}}}>
        {inner}
      </Link>
    );
  }
  else{
    return (
      <a className={classNames(styles.sidebarButton)} key={key} onClick={()=>{if(clickFn){clickFn()}}}>
        {inner}
      </a>
    )
  }
};

//<img src={props.icon == 'tutorial' ? tutorial : book} style={iconStyle}/>
