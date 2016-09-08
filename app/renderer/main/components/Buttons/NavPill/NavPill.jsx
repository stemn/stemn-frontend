import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import classes from './NavPill.css';

export default class extends React.Component{
  render() {
    return (
      <Link className={classNames(classes.button)} activeClassName="active" to={this.props.to}>
        {this.props.children}
      </Link>
    );
  }
};
