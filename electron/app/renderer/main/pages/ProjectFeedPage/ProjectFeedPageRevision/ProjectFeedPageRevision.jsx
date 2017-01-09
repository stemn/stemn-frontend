import React                from 'react';
import i                    from 'icepick';
import FileCompare          from 'stemn-frontend-shared/src/misc/FileCompare/FileCompare.jsx';

export default React.createClass({
  render() {
    const { project, item } = this.props;

//    const filePrevious = item && item.data && item.data.previousRevisionId
//    ? i.assocIn(item, ['data', 'revisionId'], item.data.previousRevisionId)
//    : null;

    return (
      <FileCompare
        project={project.data}
        file={item}
      />
    )
  }
})
