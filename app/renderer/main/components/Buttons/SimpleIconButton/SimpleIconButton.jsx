import React from 'react';

// Components

// Styles
import classNames from 'classnames';
import classes from './SimpleIconButton.css'

export default class extends React.Component{
  render() {
    return (
      <button className={classes.button} style={this.props.style}>
        {this.props.children}
      </button>
    );
  }
};
