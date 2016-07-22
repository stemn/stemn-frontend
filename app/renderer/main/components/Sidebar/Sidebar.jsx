import React from 'react';
import { Link } from 'react-router';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

// Components
//import LoadingOverlay from '../Loading/LoadingOverlay/LoadingOverlay';
import SidebarContextmenu from './SidebarContextmenu';

// Styles
import classNames from 'classnames';
import styles from './Sidebar.css';

import {MdAdd, MdSettings} from 'react-icons/lib/md';
import {GoRepo} from 'react-icons/lib/go';


const Project = (props) => {
  return (
    <Link className={styles.sidebarButton} key={props.item._id} to="/login">
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
    this.props.getProjects();
  }
  render() {
    const sidebarStyle = classNames({
      [styles.open]: this.props.sidebar.show,
      [styles.sidebar]: true,
      'rel-box': true,
      'h-100': true
    });
    return (
      <div className={sidebarStyle}>
        <div className={styles.sidebarToolbar + ' layout-row layout-align-start-center'}>
          <a onClick={()=>{}}><MdAdd size="25"/></a>
          <div className="flex"></div>
          <a onClick={()=>{}}><MdSettings size="25"/></a>
        </div>
        <div className={styles.title}>Projects</div>
          {this.props.sidebar.projects.map((item, idx) => <ProjectWithContext key={idx} item={item}/>)}
        <SidebarContextmenu />
      </div>
    );
  }
};

//        <LoadingOverlay hide={!this.props.sidebar.fetching}></LoadingOverlay>
