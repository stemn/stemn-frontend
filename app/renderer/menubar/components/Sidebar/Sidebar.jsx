import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Styles
import classNames from 'classnames';
import styles from './Sidebar.css'

import AnimateShow from 'app/renderer/shared/AnimateShow/AnimateShow.jsx'

import {MdClose} from 'react-icons/lib/md';

export default class extends React.Component{
  render() {
      return (
        <div>
          <AnimateShow show={this.props.menubarLayout.showSidebar} animation={styles.animateOverlay} animationShow={styles.animateOverlayShow}>
            <div className={styles.overlay} onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}></div>
          </AnimateShow>
          <AnimateShow show={this.props.menubarLayout.showSidebar} animation={styles.animateSidebar} animationShow={styles.animateSidebarShow}>
            <div className={classNames(styles.sidebar, 'layout-column')}>
              <div className="layout-row">
                <div className="flex"></div>
                <MdClose size="20" onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}/>
              </div>
              <div className="flex scroll-box">
                {this.props.sidebar.projects.map((project)=><div>{project.name}</div>)}
              </div>
            </div>
          </AnimateShow>

        </div>
      );
  }
};
