import React from 'react';
import classnames from 'classnames';
import styles from './header.css';
import { Link, IndexLink } from 'react-router';

import NavButton from '../Buttons/NavButton';
import {MdMenu} from 'react-icons/lib/md';



function Header({header, auth, sidebarActions}) {
  const UserAvatarStyles = {
    width: '30px',
    height: '30px'
  }
  const UserAvatar = auth.user._id ? <a><img style={UserAvatarStyles} src={'https://stemn.com' + auth.user.picture + '?size=thumb&crop=true'} /></a> : '';

  const NavButtons = header.navMenu.map((item, idx)=>{
//    const isActive = props.routing.locationBeforeTransitions.pathname == item.path;
    const isActive = false;
    const DotStyle = {
      width: '8px',
      height: '8px',
      display: 'inline-block',
      borderRadius: '50%',
      background: isActive ? 'white' : 'rgb(42, 42, 42)',
      marginLeft: '5px'
    }
    const ChangesDot = idx == 0 ? <span style={DotStyle}></span> : '';
    return (
      <Link to={item.path} key={idx} data-title="this is the title here">
        <NavButton isActive={isActive}>
          {item.name}
          {ChangesDot}
        </NavButton>
      </Link>
    )
  })

  return (
    <div className={styles.toolbar + ' layout-row layout-align-start-center rel-box'}>
     <a onClick={()=>{sidebarActions.toggleSidebar();}}><MdMenu size="25"/></a>
      <div className="flex layout-row layout-align-center">
        <div className="layout-row">{NavButtons}</div>
      </div>
      {UserAvatar}
    </div>
  )
}

export default Header;


