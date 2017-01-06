// Component Core
import React from 'react';
import { middle as middleConcat } from 'electron/app/shared/helpers/stringConcat';
import { omit } from 'lodash';

// Styles
import classes from './Tag.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { text } = this.props;
    return (
      <a className={classes.tag} { ...omit(this.props, ['text']) } >
        { middleConcat(text, 30) }
      </a>
    )
  }
});
