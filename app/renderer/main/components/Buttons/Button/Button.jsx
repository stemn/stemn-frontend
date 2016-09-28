import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Button.css';

import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

export default class extends React.Component{
  render() {
    const { loading, disabled, title, style, onClick } = this.props
    return (
      <button className={classNames(classes.button, this.props.className)}
       onClick={onClick}
       style={style}
       title={title}
       disabled={disabled}>
        {this.props.children}
        <LoadingOverlay
          size="xs"
          show={loading}
        />
      </button>
    );
  }
};
