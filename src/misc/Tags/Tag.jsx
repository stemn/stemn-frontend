// Component Core
import React from 'react';
import classNames from 'classnames';
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat';

// Styles
import classes from './Tag.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { text, className, ...otherProps } = this.props;
    return (
      <a className={classNames(classes.tag, className)} { ...otherProps }>
        { middleConcat(text, 30) }
      </a>
    )
  }
});
