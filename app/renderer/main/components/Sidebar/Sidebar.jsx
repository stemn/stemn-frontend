import React from 'react';
import { Link } from 'react-router';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';


// Components
//import LoadingOverlay from '../Loading/LoadingOverlay/LoadingOverlay';
import SidebarContextmenu from './SidebarContextmenu';

// Styles
import classNames from 'classnames';
import styles from './Sidebar.css';
import userStyles from './SidebarAvatar.css';

import {MdAdd, MdSettings, MdSearch} from 'react-icons/lib/md';
import {GoRepo} from 'react-icons/lib/go';


const Project = (props) => {
  return (
    <Link className={styles.sidebarButton} key={props.item._id} to={'/project/'+props.item.stub}>
      <div className="layout-row layout-align-start-center">
        <GoRepo size="15"/>
        <div className={styles.text + ' flex'}>{props.item.name}</div>
      </div>
    </Link>
  )
}

const ProjectWithContext = ContextMenuLayer('multi', (props) => (props.item))(Project);



export default class extends React.Component{
  componentDidMount() {
    this.props.sidebarActions.getProjects(this.props.auth.user._id);
  }
  render() {
    const sidebarStyle = classNames('layout-column', 'flex' ,'rel-box', {
      [styles.open]: this.props.sidebar.show,
      [styles.sidebar]: true,
    });
    return (
      <div className={sidebarStyle}>
        <div className={styles.sidebarToolbar + ' layout-row layout-align-start-center'}>
          <a onClick={()=>{}}><MdAdd size="25"/></a>
          <div className="flex"></div>
        </div>
        <div className={styles.sidebarSearch}>
          <input className="dr-input" type="text" placeholder="Search all projects"/>
          <MdSearch className={styles.sidebarSearchIcon} size="25"/>
        </div>

        <div className="scroll-box flex">
            {this.props.sidebar.projects.map((item, idx) => <ProjectWithContext key={idx} item={item}/>)}
            <SidebarContextmenu />
        </div>

        <div>
          <div className="layout-row layout-align-start-center">
            <PopoverMenu>
                <div className={userStyles.userWrapper + ' flex layout-row layout-align-start-center'}>
                  <img className={userStyles.userAvatar} src={'https://stemn.com' + this.props.auth.user.picture + '?size=thumb&crop=true'} />
                  <div className="flex">
                    {this.props.auth.user.name}
                  </div>
                </div>
              <div className="PopoverMenu">
                <a href="">Account Settings</a>
                <a href="">Team Settings</a>
                <a onClick={()=>{this.props.authActions.logout()}}>Sign out</a>
              </div>
            </PopoverMenu>
            <Link className={userStyles.userSettings + ' layout-column layout-align-center-center'} to="/settings"><MdSettings size="25"/></Link>
          </div>
        </div>
      </div>
    );
  }
};
//            <img style={UserAvatarStyles} src={'https://stemn.com' + auth.user.picture + '?size=thumb&crop=true'} />

//        <LoadingOverlay hide={!this.props.sidebar.fetching}></LoadingOverlay>
