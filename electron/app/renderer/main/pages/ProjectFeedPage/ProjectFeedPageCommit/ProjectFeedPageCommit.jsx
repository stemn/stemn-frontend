import React from 'react';
import { connect } from 'react-redux';

import classes             from './ProjectFeedPageCommit.css';
import FileCompare         from 'stemn-shared/misc/FileCompare/FileCompare.jsx';
import UserAvatar          from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import EditorDisplay       from 'stemn-shared/misc/Editor/EditorDisplay.jsx';
import moment              from 'moment';
import { toggleMulti }     from 'stemn-shared/misc/TogglePanel/TogglePanel.actions.js';

import { groupRevisions }  from 'stemn-shared/misc/Timeline/Timeline.utils.js';

export const ProjectFeedPageCommit = React.createClass({
  render() {
    const { project, item, dispatch } = this.props;

    const groupedRevisions = groupRevisions(item.data.items);

    const toggleMultiple = () => {
      dispatch(toggleMulti({
        cacheKeys: groupedRevisions.map(revision => revision.data.fileId+'-'+revision.data.revisionId)
      }))
    }

    return (
      <div className="layout-column flex">
        <div className={classes.commitInfo}>
          <h3>{item.data.summary}</h3>
          <div className={classes.description}>
            <EditorDisplay value={item.data.description}/>
          </div>
          <div className="layout-row layout-align-start-center">
            <UserAvatar picture={item.user.picture} name={item.user.name} size="20"/>
            <div style={{marginLeft: '10px'}}>
              {item.user.name}
              <span className="text-grey-3" style={{marginLeft: '10px'}}>{moment(item.timestamp).format('LLLL')}</span>
            </div>
            <div className="flex">
            </div>
            <a className="link-primary" onClick={toggleMultiple}>Toggle All</a>
          </div>
        </div>
        <div className="flex scroll-box">
          {item.data.items ?
            groupedRevisions.map(file => <FileCompare project={project} file={file} type="collapse" key={file._id}/>)
          : null}
        </div>
      </div>
    )
  }
});

export default connect()(ProjectFeedPageCommit);

//            <a className="link-primary">Revert</a>
//            &nbsp;&nbsp;&nbsp;
//            <a className="link-primary">View Online</a>
