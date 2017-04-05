// Component Core
import React from 'react';
import classNames from 'classnames';
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat';

// Styles
import classes from './Tag.css';

export default React.createClass({
  render() {
    const { text, className, ...otherProps } = this.props;
    return (
      <a className={classNames(classes.tag, className)} { ...otherProps }>
        <div className={ classes.tagInner }>
          { middleConcat(text, 30) }
        </div>
      </a>
    )
  }
});
