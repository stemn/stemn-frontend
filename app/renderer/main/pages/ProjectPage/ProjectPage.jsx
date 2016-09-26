import React from 'react';
import { Link } from 'react-router';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Header from 'app/renderer/main/modules/Header/Header.jsx'

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
    this.props.ProjectActions.setActiveProject({stub: this.props.params.stub});
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.stub !== this.props.params.stub) {
      this.props.ProjectsActions.getProject({projectId: nextProps.params.stub});
      this.props.ProjectActions.setActiveProject({stub: nextProps.params.stub});
    }
  }
  render() {
    const { project } = this.props;
    const baseLink = `project/${project && project.data ? project.data._id : ''}`

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
        <div className="layout-column flex rel-box">{this.props.children}</div>
      </div>
    );
  }
};

Component.childContextTypes = {
  project: React.PropTypes.object
}


export default Component
