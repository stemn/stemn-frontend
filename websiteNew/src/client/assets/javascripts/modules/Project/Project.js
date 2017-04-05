import React, { Component, PropTypes } from 'react';
import classes from './Project.css';
import classNames from 'classnames';

import { projectRoute } from 'route-actions';
import moment from 'moment';

import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import { Link } from 'react-router';

class Project extends Component {
  render() {
    const { project, className } = this.props;
    
    const projectId = project._id;
    return (
      <div className={ classNames(classes.project, 'layout-row', className) } >
        <div className='layout-column flex'>
          <Link className={ classNames('link-primary', classes.title) } to={ projectRoute({projectId}) }>{ project.name }</Link>
          <div className={ classNames('flex', classes.blurb )}>{ project.blurb }</div>
          <div className={ classes.meta }>{ moment(project.updated).fromNow() }</div>
        </div>
        { project.picture 
        ? <Link to={ projectRoute({projectId}) }>
            <img 
              className={ classes.picture } 
              src={`${GLOBAL_ENV.API_SERVER}${project.picture}?size=feed-sm&crop=true`}
            />
          </Link>
        : null }
        
      </div>
    )
  }
}

export default Project; 
