import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import classes from './NavPill.css';

export default class extends React.Component{
  render() {
    return (
      <Link className={classNames(classes.button)} activeClassName="active" to={this.props.to} onlyActiveOnIndex={this.props.onlyActiveOnIndex}>
        {this.props.children}
      </Link>
    );
  }
};
