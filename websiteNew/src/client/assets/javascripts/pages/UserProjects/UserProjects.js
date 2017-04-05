import React, { Component, PropTypes } from 'react';

import { orderBy } from 'lodash';

import classes from './UserProjects.css';
import classNames from 'classnames';

import Project from 'modules/Project';

export default class UserProjects extends Component {
  render() {
    const { projects } = this.props;
    return (
      <div className={ classes.panel }>
        { orderBy(projects.data, 'updated', 'desc').map(project => (
          <Project key={ project._id } project={ project } className={ classes.project } />
        ))}
      </div>
    )
  }
}
