import React, { Component, PropTypes } from 'react';
import classes from './Project.css';
import classNames from 'classnames';

import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import { Link } from 'react-router';

class Project extends Component {
  render() {
    const { project } = this.props;
    return (
      <div>
        <Link className={classes.project} to={ `/project/${ project._id }` }>
          { project.name }
        </Link>
      </div>
    )
  }
}

export default Project;