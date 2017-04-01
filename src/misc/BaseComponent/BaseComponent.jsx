import React from 'react';
import classNames from 'classnames';

const BaseComponent = (rootClass) => (props) => {
  const { className, children, ...otherProps } = props;
  return (
    <div className={ classNames(rootClass, className) } { ...otherProps }>
      { props.children }
    </div>
  )
};

export default BaseComponent;