// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SidebarActions from 'app/shared/actions/sidebar';
import * as AuthActions from 'app/shared/actions/auth';
import * as ProjectsActions from 'app/shared/actions/projects';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import styles from './Sidebar.css';
import userStyles from './SidebarAvatar.css';

// Sub Components
import DragResize      from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import { Link } from 'react-router';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import { Field } from 'react-redux-form';
import SidebarContextmenu from './SidebarContextmenu';
import SidebarProjectButton from './SidebarProjectButton.jsx';
import {MdAdd, MdSettings, MdSearch, MdMenu} from 'react-icons/lib/md';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const ProjectWithContext = ContextMenuLayer('multi', (props) => (props.item))(SidebarProjectButton);

export const Component = React.createClass({

//  componentDidMount() {
//    this.props.authActions.getProjects({
//      userId: this.props.auth.user._id,
//    });
//  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.user._id && !nextProps.auth.projects.loading && !nextProps.auth.projects.data){
      nextProps.authActions.getProjects({
        userId: nextProps.auth.user._id,
      });
    }
  },


  render() {
    const { ProjectsActions } = this.props;
    const sidebarStyle = classNames('layout-column', 'flex' ,'rel-box', styles.sidebar);

    const nameRegex = new RegExp(this.props.sidebar.searchString, 'i');
    const filteredProjects = this.props.auth.projects.data ? this.props.auth.projects.data.filter((project) => nameRegex.test(project.name)) : [];
    const routeState = {meta : {scope: ['main', 'menubar']}}


    return (
      <DragResize side="right" width="300" widthRange={[0, 500]} animateHide={!this.props.sidebar.show} className="layout-column flex">
        <div className={sidebarStyle}>
          <div className={styles.sidebarToolbar + ' layout-row layout-align-start-center'}>

            <PopoverMenu preferPlace="below">
              <div>
                <MdAdd size="25"/>
              </div>
              <div className="PopoverMenu">
                <a onClick={()=>ProjectsActions.createProject()}>Create New Project</a>
                <a href="">Create New Thread</a>
              </div>
            </PopoverMenu>

            <div className="flex"></div>
            <a onClick={()=>{this.props.sidebarActions.toggleSidebar();}}><MdMenu size="25"/></a>

          </div>
          <div className={styles.sidebarSearch}>
            <Field model="sidebar.searchString">
              <input className="dr-input text-ellipsis" type="text" placeholder="Search all projects"/>
            </Field>
            <MdSearch className={styles.sidebarSearchIcon} size="25"/>
          </div>

          <div className="scroll-box flex">
              {filteredProjects.map((item, idx) => <ProjectWithContext key={idx} item={item} isActive={item._id == this.props.params.stub} to={{pathname: `/project/${item._id}`, state: routeState}}/>)}
              <SidebarContextmenu />
          </div>

          <div>
            <div className="layout-row layout-align-start-center">
              <Link to="/dashboard" className="flex">
                <div className={userStyles.userWrapper + ' flex layout-row layout-align-start-center'}>
                  <img className={userStyles.userAvatar} src={'https://stemn.com' + this.props.auth.user.picture + '?size=thumb&crop=true'} />
                  <div className="flex text-ellipsis">
                    {this.props.auth.user.name}
                  </div>
                </div>
              </Link>
              <PopoverMenu>
                <Link className={userStyles.userSettings + ' layout-column layout-align-center-center'} to="/settings/application"><MdSettings size="25"/></Link>
                <div className="PopoverMenu">
                  <Link to="/settings/account">Account Settings</Link>
                  <Link to="/settings/application">Application Settings</Link>
                  <a onClick={()=>{this.props.authActions.logout()}}>Sign out</a>
                </div>
              </PopoverMenu>
            </div>
          </div>
        </div>
      </DragResize>

    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ sidebar, auth }, {params}) {
  return {
    sidebar,
    auth,
    params
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
