//import React from 'react';
//
//// Styles
//import classNames from 'classnames';
//import classes from './Button.css';
//
//import LoadingOverlay from 'stemn-frontend-shared/src/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
//
//export default class extends React.Component{
//  render() {
//    const { loading, disabled, title, style, onClick, type } = this.props
//    return (
//      <button className={classNames(classes.button, this.props.className)}
//       onClick={() => {if(onClick){onClick()}}}
//       style={style}
//       title={title}
//       type={type}
//       disabled={disabled}>
//        {this.props.children}
//        <LoadingOverlay
//          size="xs"
//          show={loading}
//        />
//      </button>
//    );
//  }
//};

import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Button.css';

export default class extends React.Component{
  render() {
    const { loading, disabled, title, style, onClick, type } = this.props
    return (
      <button className={classNames(classes.button, this.props.className)}
       onClick={() => {if(onClick){onClick()}}}
       style={style}
       title={title}
       type={type}
       disabled={disabled}>
        {this.props.children}
      </button>
    );
  }
};
