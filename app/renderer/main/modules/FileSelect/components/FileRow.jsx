import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './FileRow.css'

import bytes from 'app/shared/helpers/filters/bytes.js';
import FileIcon from './FileIcon'

export default React.createClass({
  render() {
    const {singleClick, doubleClick, isActive, file} = this.props;

    const timeFromNow = moment(file.modified).fromNow();

    return (
      <div className={classNames(classes.row, 'layout-row layout-align-start-center', {[classes.active]: isActive})} onClick={()=>singleClick({file})} onDoubleClick={()=>doubleClick({file})} >
        <FileIcon fileType={file.fileType}/>
        <div className="flex">{file.name}</div>
        <div style={{width: '100px'}}>{timeFromNow}</div>
        <div style={{width: '50px'}}>{bytes(file.size)}</div>
      </div>
    );
  }
});
