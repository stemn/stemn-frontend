import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './FileRow.css'

import bytes from 'stemn-shared/utils/filters/bytes.js';
import FileIcon from './FileIcon'
import Label from 'stemn-shared/misc/Label/Label.jsx'
import Link from 'stemn-shared/misc/Router/Link';

export default React.createClass({
  render() {
    const { singleClick, doubleClick, isActive, file } = this.props;

    const timeFromNow = moment(file.modified).fromNow();

    return (
      <div className={classNames(classes.row, 'layout-row layout-align-start-center', {[classes.active]: isActive})} >
        <div className={classes.clickOverlay} onClick={()=>singleClick({file})} onDoubleClick={()=>doubleClick({file})}/>
        <FileIcon fileType={file.extension} type={file.type}/>
        <div style={{width: '200px'}} className="text-ellipsis">{file.name}</div>
        { file.commit && file.commit.summary && file.commit._id
        ? <Link
            name='commitRoute'
            params={ { projectId: file.project._id, commitId: file.commit._id } }
            show
            scope="main"
            className={ classNames(classes.clickable, 'link-primary') }
          >
          {file.commit.summary}
          </Link>
        : null }
        <div className="flex"></div>
        { file.revisionNumber > 1
        ? <div style={{padding: '0 15px'}}><Label title={file.revisionNumber + ' revisions'}>{file.revisionNumber} Revisions</Label></div>
        : null }
        <div style={{width: '100px'}}>{file.modified ? timeFromNow : ''}</div>
        <div style={{width: '80px'}}>{bytes(file.size)}</div>
      </div>
    );
  }
});
