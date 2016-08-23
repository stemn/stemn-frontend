import React from 'react';

// Styles
import classes from './Button.css';

export default class extends React.Component{
  render() {
    return (
      <button className={classes.button}>
        {this.props.children}
      </button>
    );
  }
};
