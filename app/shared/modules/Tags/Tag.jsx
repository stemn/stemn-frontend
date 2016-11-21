// Component Core
import React from 'react';
import { middle as middleConcat } from 'app/shared/helpers/stringConcat';

// Styles
import classes from './Tag.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { text, style } = this.props;
    return (
      <a className={classes.tag} style={style}>
        { middleConcat(text, 30) }
      </a>
    )
  }
});
