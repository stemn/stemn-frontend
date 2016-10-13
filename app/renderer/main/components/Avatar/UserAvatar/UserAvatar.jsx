import React from 'react';
import Autosuggest from 'react-autosuggest';
//import styles from './UserAvatar.css';

export default React.createClass({
  default: '/assets/images/default/user-1.png',
  render() {
    const styles = {
      borderRadius: this.props.shape == 'square' ? '3px' : '50%',
      width: this.props.size || '30px',
      height: this.props.size || '30px'
    };
    return (
      <img className={this.props.className} style={styles} src={`https://stemn.com${this.props.picture || this.default}?size=thumb&crop=true`} />
    );
  }
})
