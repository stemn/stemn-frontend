import React from 'react';

import classes             from './ProjectFeedPageCommit.css';
import FileCompareCollapse from 'app/renderer/main/modules/FileCompare/FileCompareCollapse/FileCompareCollapse.jsx';
import UserAvatar          from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import EditorDisplay       from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';

import { groupRevisions }  from 'app/renderer/main/modules/Timeline/Timeline.utils.js'

export default React.createClass({
  render() {
    const { project, item } = this.props;
    return (
      <div className="layout-column flex">
        <div className={classes.commitInfo}>
          <h3>{item.data.summary}</h3>
          <div className={classes.description}>
            <EditorDisplay value={item.data.description}/>
          </div>
          <div className="layout-row layout-align-start-center">
            <UserAvatar picture={item.user.picture} name={item.user.name} size="20"/>
            <div style={{marginLeft: '10px'}}>{item.user.name}</div>
            <div className="flex">
            </div>
          </div>
        </div>
        <div className="flex scroll-box">
          {item.data.items ?
            groupRevisions(item.data.items).map(file => <FileCompareCollapse project={project} file={file}/>)
          : null}
        </div>
      </div>
    )
  }
})

//            <a className="link-primary">Revert</a>
//            &nbsp;&nbsp;&nbsp;
//            <a className="link-primary">View Online</a>