import React from 'react';

// Components

// Styles
import classNames from 'classnames';
import classes from './SimpleIconButton.css'

export default class extends React.Component{
  render() {
    const { style, onClick, title, className, color} = this.props
    return (
      <button className={classNames( classes.button, className, {[classes.white] : color == 'white'})} style={style} onClick={onClick} title={title}>
        {this.props.children}
      </button>
    );
  }
};
