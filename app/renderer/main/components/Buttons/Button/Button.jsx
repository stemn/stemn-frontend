import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Button.css';

import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

export default class extends React.Component{
  render() {
    const { loading } = this.props
    return (
      <button className={classNames(classes.button, this.props.className)}
       onClick={this.props.onClick}
       style={this.props.style}
       title={this.props.title}>
        {this.props.children}
        <LoadingOverlay
          size="xs"
          show={loading}
        />
      </button>
    );
  }
};
