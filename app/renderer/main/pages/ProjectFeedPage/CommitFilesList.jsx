import React from 'react';

import classes            from './CommitFilesList.css';
import CommitFile         from './CommitFile.jsx';
import { groupRevisions } from 'app/renderer/main/modules/Timeline/Timeline.utils.js'

export default React.createClass({
  onSelect(response){
    console.log(response);
  },
  isSelected(item){
//    return item.data.revisionId == this.props.fileMeta.data.revisionId;
  },
  render() {
    const { items, project } = this.props;
    return (
      <div>
        {groupRevisions(items).map(file => <CommitFile project={project} file={file}/>)}
      </div>
    )
  }
})
