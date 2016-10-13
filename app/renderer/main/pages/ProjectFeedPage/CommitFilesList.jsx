import React from 'react';
import i from 'icepick';
import { groupBy, values } from 'lodash';

import classes            from './CommitFilesList.css';

import TogglePanel        from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';

export default React.createClass({
  render() {
    const { items, project } = this.props;
    return (
      <div>
        {groupRevisions(items).map(group =>{
          return (
            <TogglePanel>
              <div className="layout-row flex layout-align-start-center">
                <div className="flex">{group.path}</div>
                <FileCompareMenu compareId={`feed-${project.data._id}-${group.revisions[0]._id}`}/>
              </div>
              <DragResize side="bottom" height="500" heightRange={[0, 1000]} className="layout-column flex">
                <FileCompare
                  compareId={`feed-${project.data._id}-${group.revisions[0]._id}`}
                  project={project.data}
                  file1={group.revisions[0].data}
                  file2={group.revisions[1].data} />
                <Timeline className={classes.timeline}
                  size="sm"
                  items={group.revisions}
                  preferPlace="above" />
              </DragResize>
            </TogglePanel>
          )
        })}
      </div>
    )
  }
})

//        const filePrevious = file.data.previousRevisionId ? i.assocIn(file, ['data', 'revisionId'], file.data.previousRevisionId) : null;
//            <div className="layout-row flex layout-align-start-center">
//              <div className="flex">{file.data.path}</div>
//              <FileCompareMenu
//                compareId={`feed-${project.data._id}-${file.data._id}`}/>
//            </div>


////////////////////////////////////////////////////////////////

function groupRevisions(revisions){
  return values(groupBy(revisions, 'data.fileId')).map(group => {
    return {
      name: group[0].data.name,
      fileId: group[0].data.fileId,
      path: group[0].data.path,
      revisions: group
    }
  })
}
