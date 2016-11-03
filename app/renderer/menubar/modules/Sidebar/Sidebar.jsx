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
import MdSearch from 'react-icons/md/search';
import Input from 'app/renderer/main/components/Input/Input/Input';


///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { menubarLayout, projects, sidebar } = this.props;

    const linkProject = (item) => {
      return {
        pathname: `/project/${item._id}`,
        state: {meta : {scope: ['main', 'menubar']}}
      }
    }

    const nameRegex = new RegExp(sidebar.searchString, 'i');
    const filteredProjects = projects.userProjects.data ? projects.userProjects.data.filter(project => nameRegex.test(project.name)) : [];

    return (
      <div>
        <AnimateShow show={menubarLayout.showSidebar} animation={classes.animateOverlay} animationShow={classes.animateOverlayShow}>
          <div className={classes.overlay} onClick={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}></div>
        </AnimateShow>
        <div className={classNames(classes.sidebar, 'layout-column', {[classes.sidebarShow] : menubarLayout.showSidebar})}>
          <div className={classes.sidebarSearch}>
            <Input 
              model="sidebar.searchString"
              value={sidebar.searchString}
              className="dr-input text-ellipsis" 
              type="text" 
              placeholder="Search all projects"
            />
            <MdSearch className={classes.sidebarSearchIcon} size="20"/>
          </div>
          <div className="flex scroll-box">
            {filteredProjects.map((item)=>
               <SidebarProjectButton item={item} to={linkProject(item)} clickFn={()=>this.props.MenubarLayoutActions.toggleSidebar(false)}/>
            )}
          </div>
        </div>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ menubarLayout, projects, sidebar }) {
  return {
    sidebar,
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
