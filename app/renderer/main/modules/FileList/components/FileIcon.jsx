import React from 'react';
const fileTypeIcons = require.context("app/renderer/assets/icons/filetype", true);
  
// Styles
import classNames from 'classnames';

export default React.createClass({
  render() {
    const fileType = this.props.fileType ? this.props.fileType.toLowerCase() : 'folder';
    
    let src;
    try {
      src = fileTypeIcons(`./${fileType}.svg`);
    }
    catch(err) {
      src = fileTypeIcons(`./other.svg`);
    }
    
    const style = {
      width: this.props.size || '30px',
      height:  this.props.size || '30px',
      marginRight: '10px'
    }
    return (
      <img style={style} src={src} />
//      <img style={style} src={`https://stemn.com/assets/images/vectors/filetype/${fileType}.svg`} />
    );
  }
});
