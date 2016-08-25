import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Button.css';

export default class extends React.Component{
  render() {
    return (
      <button className={classNames(classes.button, this.props.className)} onClick={this.props.onClick} style={this.props.style}>
        {this.props.children}
      </button>
    );
  }
};
