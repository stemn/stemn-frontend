import React from 'react';
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import classes from './NavPill.css';

export default class extends React.Component{
  render() {
    if(this.props.to){
      return (
        <Link className={classNames(classes.button, this.props.className)} activeClassName="active" to={this.props.to} onlyActiveOnIndex={this.props.onlyActiveOnIndex}>
          {this.props.children}
        </Link>
      );
    }
    else{
      return (
        <a className={classNames(classes.button, this.props.className)} href={this.props.href}>
          {this.props.children}
        </a>
      );
    }
  }
};
