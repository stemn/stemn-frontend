// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as MenubarLayoutActions from 'app/shared/actions/menubarLayout';

// Component Core
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Styles
import classNames from 'classnames';
import classes from './Sidebar.css'


// Sub Components
import AnimateShow from 'app/renderer/shared/AnimateShow/AnimateShow.jsx'
import SidebarProjectButton from 'app/renderer/main/modules/Sidebar/SidebarProjectButton.jsx'
import { MdClose } from 'react-icons/lib/md';


///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { menubarLayout, projects } = this.props;
    const routeState = {meta : {scope: ['main', 'menubar']}}
    return (
      <div>
        <AnimateShow show={menubarLayout.showSidebar} animation={classes.animateOverlay} animationShow={classes.animateOverlayShow}>
          <div className={classes.overlay} onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}></div>
        </AnimateShow>
        <div className={classNames(classes.sidebar, 'layout-column', {[classes.sidebarShow] : menubarLayout.showSidebar})}>
          <div className="flex scroll-box">
            {projects.userProjects.data.map((item)=>
               <SidebarProjectButton item={item} to={{pathname: `/project/${item._id}/changes`, state: routeState}} clickFn={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}/>
            )}
          </div>
        </div>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ menubarLayout, projects }) {
  return {
    menubarLayout,
    projects
  };
}

function mapDispatchToProps(dispatch) {
  return {
    MenubarLayoutActions: bindActionCreators(MenubarLayoutActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
