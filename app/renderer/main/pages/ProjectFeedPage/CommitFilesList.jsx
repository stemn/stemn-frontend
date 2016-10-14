import React from 'react';
import { groupBy, values } from 'lodash';

import classes            from './CommitFilesList.css';
import CommitFile         from './CommitFile.jsx';


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

////////////////////////////////////////////////////////////////

function groupRevisions(revisions){
  return values(groupBy(revisions, 'data.fileId')).map(file => {
    return {
      name: file[0].data.name,
      fileId: file[0].data.fileId,
      path: file[0].data.path,
      revisions: file
    }
  })
}
