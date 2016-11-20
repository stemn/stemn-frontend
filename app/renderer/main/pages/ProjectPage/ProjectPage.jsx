// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SystemActions from 'app/shared/actions/system';

// Component Core
import React from 'react';
import { Link } from 'react-router';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Header from 'app/renderer/main/modules/Header/Header.jsx'
import Banner from 'app/renderer/main/modules/Banner/Banner.jsx'

// Styles
import classNames from 'classnames';
import pageStyles from './ProjectPage.css'

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
    const { project, system, systemActions } = this.props;
    const baseLink = `project/${project && project.data ? project.data._id : ''}`;
    const downloadLinks = {
      drive   : 'https://tools.google.com/dlpage/drive/index.html',
      dropbox : 'https://www.dropbox.com/downloading'
    }
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

    if(!project){return <div></div>}

    return (
      <div className="layout-column flex rel-box">
        <Header>{project.data ? project.data.name : ''}</Header>
        <Tabs size="lg">
          <Link activeClassName="active" to={baseLink} onlyActiveOnIndex={true}>Changes</Link>
          <Link activeClassName="active" to={baseLink+'/feed'}>Timeline</Link>
          <Link activeClassName="active" to={baseLink+'/tasks'}>Tasks</Link>
          <Link activeClassName="active" to={baseLink+'/settings'}>Settings</Link>
        </Tabs>
        { project.data
        ? missingClientBanner()
        : null }
        <div className="layout-column flex rel-box">{this.props.children}</div>
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
    systemActions: bindActionCreators(SystemActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
