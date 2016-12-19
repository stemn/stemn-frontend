import React, { Component } from 'react';

// Styles
import classes from './LoadingLinear.css';

export default class extends Component {
    render() {
      const { type } = this.props;
      const width = width >= 0 ? {width: width + '%'} : {};
      return (
        <div className={classes.progress}>
          <div className={type == 'determinate' ? classes.determinate : classes.indeterminate} style={width} />
        </div>
      )
    }
}
