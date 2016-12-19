// Component Core
import React from 'react';

// Styles
import classes from './SectionTitle.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { children, style } = this.props;
    return (
      <div className={classes.section + ' layout-row'} style={style}>
        <div className={classes.text}>{children}</div>
      </div>
    )
  }
});
