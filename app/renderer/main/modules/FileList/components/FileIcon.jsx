import React from 'react';

// Styles
import classNames from 'classnames';

export default React.createClass({
  render() {
    const style = {
      width: this.props.size || '30px',
      height:  this.props.size || '30px',
      marginRight: '10px'
    }
    return (
      <img style={style} src={`https://stemn.com/assets/images/vectors/filetype/${this.props.fileType || 'folder'}.svg`} />
    );
  }
});
