import React from 'react';

import FileCompareMenu from '../FileCompareMenu/FileCompareMenu.jsx'

// Styles
import classes from './FileCompareHeader.css'

export default React.createClass({
  render() {
    const { file1, compareId } = this.props;
    return(
      <div className={classes.header + ' layout-row layout-align-start-center'}>
        <div className="flex text-ellipsis">{file1.path}</div>
        <FileCompareMenu compareId={compareId}/>
      </div>
    )
  }
});
