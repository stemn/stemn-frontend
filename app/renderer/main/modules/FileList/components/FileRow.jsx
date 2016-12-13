import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './FileRow.css'

import bytes from 'app/shared/helpers/filters/bytes.js';
import FileIcon from './FileIcon'
import Label        from 'app/shared/modules/Label/Label.jsx'
import Link                from 'app/shared/modules/Router/Link/Link.jsx';

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
        ? <Link path={`/project/${file.project._id}/feed`}
            show={true}
            query={{ item: file.commit._id }}
            scope="main"
            className={classNames(classes.clickable, 'link-primary flex')}
          >
          {file.commit.summary}
          </Link>
        : null }
        <div className="flex"></div>
        { file.revisionNumber > 1
        ? <div style={{padding: '0 15px'}}><Label title={file.revisionNumber + ' revisions'}>{file.revisionNumber} Revisions</Label></div>
        : null }
        <div style={{width: '100px'}}>{file.modified ? timeFromNow : ''}</div>
        <div style={{width: '50px'}}>{bytes(file.size)}</div>
      </div>
    );
  }
});
