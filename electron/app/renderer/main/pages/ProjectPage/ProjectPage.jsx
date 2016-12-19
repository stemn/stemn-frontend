// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SystemActions from 'app/shared/modules/System/System.actions.js';

// Component Core
import React from 'react';
import { Link } from 'react-router';
import { has } from 'lodash';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Header from 'app/renderer/main/modules/Header/Header.jsx'
import Banner from 'app/renderer/main/modules/Banner/Banner.jsx'
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import MdSettings from 'react-icons/md/settings';
import MdExpandMore from 'react-icons/md/expand-more';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import PopoverMenuList from 'app/renderer/main/components/PopoverMenu/PopoverMenuList';
import PopoverDetails from 'app/renderer/main/components/PopoverMenu/PopoverDetails';
import ProjectMenu from 'app/renderer/main/modules/Projects/Project.menu.js';
import MdPublic       from 'react-icons/md/public';
import MdLockOutline  from 'react-icons/md/lock-outline';
import folderLockedVector   from 'app/renderer/assets/images/pure-vectors/folder-locked.svg';
import globalVector   from 'app/renderer/assets/images/pure-vectors/global.svg';

// Styles
import classNames from 'classnames';
import classes from './ProjectPage.css'

class Component extends React.Component{
  getChildContext() {
    return {
      project: this.props.project
    }
  }
  componentWillMount() {
    this.props.ProjectsActions.getProject({projectId: this.props.params.stub});
    this.props.ProjectsActions.setActiveProject({projectId: this.props.params.stub});
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.stub !== this.props.params.stub) {
      this.props.ProjectsActions.getProject({projectId: nextProps.params.stub});
      this.props.ProjectsActions.setActiveProject({projectId: nextProps.params.stub});
    }
  }
  render() {
    const { project, system, children, systemActions, params, dispatch } = this.props;
    const baseLink       = `project/${project && project.data ? project.data._id : ''}`;
    const isLoading      = !project || !project.data;
    const isConnected    = project && project.data && project.data.remote && project.data.remote.provider;
    const hasName        = project && project.data && project.data.name;
    const routeName      = this.props.routes[this.props.routes.length - 1];

    const downloadLinks = {
      drive   : 'https://tools.google.com/dlpage/drive/index.html',
      dropbox : 'https://www.dropbox.com/downloading'
    };

    const menu = [{
      label: 'Project Settings',
      onClick: () => {}
    },{
      label: 'Delete Projects',
      onClick: this.deleteTask
    }];

    const missingClientBanner = () => {
      const provider   = project.data.remote.provider;
      const capitalize = { textTransform: 'capitalize' };
      const underline  = { textDecoration: 'underline' };
      if(provider && !system.providerPath[provider]){
        return (
          <Banner type="warn">
            Could not find <span style={capitalize}>{provider}</span> on your computer.
            The <span style={capitalize}>{provider}</span> desktop client must be installed for this project to sync to your computer.
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style={underline} href={downloadLinks[provider]}>Download {provider}</a>
            &nbsp;or&nbsp;
            <a style={underline} onClick={systemActions.getProviderPath}>Check again.</a>
          </Banner>
        );
      }
      else{
        return null
      }
    }

    const getVisibilityPopup = () => {
      return project.data.permissions.projectType == 'public'
      ? <PopoverDetails>
          <div className="header">Public Project</div>
          <div className="body" style={{paddingTop: '5px'}}>
            <div className="layout-row layout-align-center"><img src={globalVector} style={{height: '80px'}}/></div>
            <p>Your project data is public - it will be accessible on stemn.com.</p>
            <p>Your data and files will be visible to everyone - only team-members can edit.</p>
          </div>
          <div className="footer layout-row">
            <a className="link-primary" href={`https://stemn.com/projects/${project.data._id}`}>View online</a>
            <div className="flex"></div>
            <Link className="link-grey" to={baseLink+'/settings'}>Change</Link>
          </div>
        </PopoverDetails>
      : <PopoverDetails>
          <div className="header">Private project</div>
          <div className="body" style={{paddingTop: '5px'}}>
            <div className="layout-row layout-align-center"><img src={folderLockedVector} style={{height: '80px'}}/></div>
            <p>Your project data is private - it will not be accessible on stemn.com.</p>
            <p>Consider open-sourcing this project or upgrading to Stemn Pro to access additional features such as infinite revision history.</p>
          </div>
          <div className="footer layout-row">
            <a className="link-primary" href={`https://stemn.com/projects/${project.data._id}`}>View online</a>
            <div className="flex"></div>
            <Link className="link-grey" to={baseLink+'/settings'}>Change</Link>
          </div>
        </PopoverDetails>
    }

    return (
      <div className="layout-column flex rel-box">
        <div className="layout-column flex">
          <Header>
            <PopoverMenu preferPlace="below" tipSize={6}>
              <a className={classes.title + ' text-ellipsis'}>{hasName ? project.data.name : ''}<MdExpandMore style={{marginLeft: '5px'}} size="18px"/></a>
              <PopoverMenuList item={project && project.data ? project.data : {}} menu={ProjectMenu(dispatch)}/>
            </PopoverMenu>

            <div className={classes.tabs + ' flex layout-row layout-align-start-center'}>
              <Link activeClassName="active" to={baseLink} onlyActiveOnIndex={true}>Changes</Link>
              { isConnected ? <Link activeClassName="active" to={baseLink+'/feed'}>Commits</Link> : null }
              <Link activeClassName="active" to={baseLink+'/tasks'}>Tasks</Link>
              { isConnected ? <Link className={['files/:path', 'files'].includes(routeName.path) ? 'active' : ''} to={baseLink+'/files/'}>Files</Link> : null }
            </div>
            <PopoverMenu preferPlace="below" tipSize={6} trigger="click">
              <SimpleIconButton title="Visibility Settings">
                {has(project, 'data.permissions.projectType') && project.data.permissions.projectType == 'public' ? <MdPublic style={{color: '#bbe8bb'}} size={20}/> : <MdLockOutline style={{color: '#bbe8bb'}} size={20}/>}
              </SimpleIconButton>
              {has(project, 'data.permissions.projectType') ? getVisibilityPopup() : null}
            </PopoverMenu>
            <div className="divider"></div>
            <SimpleIconButton activeClassName="active" to={baseLink+'/settings'} title="Project Settings">
              <MdSettings size={20}/>
            </SimpleIconButton>
            <div className="divider"></div>
          </Header>
          { isConnected
          ? missingClientBanner()
          : null }
          <div className="layout-column flex rel-box">
            { !isLoading
            ? children
            : null }
            <LoadingOverlay show={isLoading}/>
          </div>
        </div>
      </div>
    );
  }
};



Component.childContextTypes = {
  project: React.PropTypes.object
}

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({system}) {
  return {
    system,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    systemActions: bindActionCreators(SystemActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
