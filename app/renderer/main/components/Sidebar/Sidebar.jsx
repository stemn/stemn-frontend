import React from 'react';
import { Link } from 'react-router';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import { Field } from 'react-redux-form';
import _ from 'lodash';


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
    <Link className={classNames(styles.sidebarButton, {[styles.active] : props.isActive} )} key={props.item._id} to={`/project/${props.item.stub}/changes`}>
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
    this.props.sidebarActions.getProjects({
        userId: this.props.auth.user._id,
      });
  }
  render() {
    const sidebarStyle = classNames('layout-column', 'flex' ,'rel-box', styles.sidebar, {[styles.open]: this.props.sidebar.show});

    const nameRegex = new RegExp(this.props.sidebar.searchString, 'i');
    const filteredProjects = this.props.sidebar.projects.filter((project) => nameRegex.test(project.name));

    return (
      <div className={sidebarStyle}>
        <div className={styles.sidebarToolbar + ' layout-row layout-align-start-center'}>

          <PopoverMenu preferPlace="below">
            <div>
              <MdAdd size="25"/>
            </div>
            <div className="PopoverMenu">
              <a href="">Create New Project</a>
              <a href="">Create New Thread</a>
            </div>
          </PopoverMenu>

          <div className="flex"></div>
        </div>
        <div className={styles.sidebarSearch}>
          <Field model="sidebar.searchString">
            <input className="dr-input" type="text" placeholder="Search all projects"/>
          </Field>
          <MdSearch className={styles.sidebarSearchIcon} size="25"/>
        </div>

        <div className="scroll-box flex">
            {filteredProjects.map((item, idx) => <ProjectWithContext key={idx} item={item} isActive={item.stub == this.props.params.stub}/>)}
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
