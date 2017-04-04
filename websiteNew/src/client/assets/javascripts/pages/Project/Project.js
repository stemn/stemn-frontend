import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';
import classes from './Project.css';

import StandardLayout from 'layout/StandardLayout';
import Tabs from 'stemn-shared/misc/Tabs/Tabs';
import { Container } from 'stemn-shared/misc/Layout';
import { Link } from 'react-router';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';


class Project extends Component {
  renderComplete() {
    const { children, project, pathname } = this.props;
    return (
      <div className="layout-column flex">
        <div className={ classes.header }>
          <Container className={classNames(classes.headerInner, 'layout-row layout-align-start-center')}>
            <a href="">
              <UserAvatar
                name={ project.data.team[0].name }
                picture={ project.data.team[0].picture }
                size={ 30 }
                shape='square'
              />
            </a>
            <h1 className={ classes.title }>
              { project.data.name }
            </h1>
            <div className='flex'></div>
            <Tabs noline className={ classes.tabs }>
              <Link 
                className={ classNames({ 'active': pathname === `/project/${project.data._id}` }) } 
                to={`/project/${project.data._id}`}>
                Overview
              </Link>
              <Link 
                className={ classNames({ 'active': pathname.includes(`/project/${project.data._id}/commits`) }) } 
                to={`/project/${project.data._id}/commits`}>
                15 Commits
              </Link>
              <Link 
                className={ classNames({ 'active': pathname.includes(`/project/${project.data._id}/tasks`) }) } 
                to={`/project/${project.data._id}/tasks`}>
                6 Tasks
              </Link>
              <Link 
                className={ classNames({ 'active': pathname.includes(`/project/${project.data._id}/settings`) }) } 
                to={`/project/${project.data._id}/settings`}>
                Settings
              </Link>
            </Tabs>
          </Container>
        </div>
        <div className={ classNames('flex') }>
          { children }
        </div>
      </div>
    )
  }
  renderPending() {
    return (
      <div>Loading</div>
    )
  }
  render() {
    const { project } = this.props;
    return (
      <StandardLayout style={ { marginTop: '30px' } }>
        { project && project.data
          ? this.renderComplete()
          : this.renderPending()
        }
      </StandardLayout>
    )
  }
}

export default Project;
