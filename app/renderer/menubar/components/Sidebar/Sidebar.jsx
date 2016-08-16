import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Styles
import classNames from 'classnames';
import styles from './Sidebar.css'

import AnimateShow from 'app/renderer/shared/AnimateShow/AnimateShow.jsx'
import SidebarProjectButton from 'app/renderer/main/components/Sidebar/SidebarProjectButton.jsx'

import {MdClose} from 'react-icons/lib/md';

export default class extends React.Component{
  render() {
    return (
      <div>
        <AnimateShow show={this.props.menubarLayout.showSidebar} animation={styles.animateOverlay} animationShow={styles.animateOverlayShow}>
          <div className={styles.overlay} onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}></div>
        </AnimateShow>

        <div className={classNames(styles.sidebar, 'layout-column', {[styles.sidebarShow] : this.props.menubarLayout.showSidebar})}>
          <div className="flex scroll-box">
            {this.props.sidebar.projects.map((item)=>
               <SidebarProjectButton item={item} to={`/project/${item.stub}/changes`} clickFn={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}/>
            )}
          </div>
        </div>
      </div>
    );
  }
};
