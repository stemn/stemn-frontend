import React from 'react';
import classNames from 'classnames';
import styles from './header.css';
import { Link, IndexLink } from 'react-router';

import NavButton from '../Buttons/NavButton';
import {MdMenu} from 'react-icons/lib/md';

function Header({header, auth, sidebarActions, headerActions, authActions, location}) {
  const NavButtons = header.navMenu.map((item, idx)=>{
    const isActive = location.pathname == item.path;
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
      <div className={styles.navButtons + ' flex layout-row layout-align-center'}>
        <div className='layout-row'>{NavButtons}</div>
      </div>
    </div>
  )
}

export default Header;


