import React from 'react';
import Autosuggest from 'react-autosuggest';
//import styles from './UserAvatar.css';

export default React.createClass({
  default: '/assets/images/default/user-1.png',
  render() {
    const { style, shape, size, className, picture, title } = this.props;
    const styles = {
      borderRadius: shape == 'square' ? '3px' : '50%',
      width: size || '30px',
      height: size || '30px'
    };
    const actualStyles = Object.assign({}, style, styles);
    return (
      <img className={className}
        title={title}
        style={actualStyles}
        src={`https://stemn.com${picture || this.default}?size=thumb&crop=true`}
      />
    );
  }
})
