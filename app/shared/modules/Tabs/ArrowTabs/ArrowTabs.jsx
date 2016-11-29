// Component Core
import React, { PropTypes } from 'react';
import { omit } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './ArrowTabs.css';
import MdChrevronRight from 'react-icons/md/chevron-right';

const arrowTabsPropTypes = {
  children  : PropTypes.node.isRequired,      // Child element
  className : PropTypes.string,      // Classes
}
const arrowTabPropTypes = {
  children : PropTypes.node.isRequired,      // Child element
  isActive : PropTypes.bool,                 // Is the tab active?
  arrow    : PropTypes.bool,                 // Should we show the arrow?
}

export const ArrowTabs = React.createClass({
  propTypes: arrowTabsPropTypes,
  render() {
    const { children, className } = this.props;
    return (
      <div { ...omit(this.props, Object.keys(arrowTabsPropTypes))}
        className={classNames(classes.tabs, className)}
        >
        {children}
      </div>
    )
  }
});

export const ArrowTab = React.createClass({
  propTypes: arrowTabPropTypes,
  render() {
    const { children, isActive, arrow } = this.props;
    return (
      <div className="layout-row layout-align-start-center">
        <a { ...omit(this.props, Object.keys(arrowTabPropTypes))}
          className={classNames(classes.tab, {[classes.tabActive] : isActive})}>
          {children}
        </a>
        {arrow ? <MdChrevronRight className={classes.arrow} size="22px"/> : null}
      </div>

    )
  }
});
