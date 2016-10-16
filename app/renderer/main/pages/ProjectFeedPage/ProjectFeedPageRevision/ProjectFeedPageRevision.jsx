import React                from 'react';
import i                    from 'icepick';
import FileCompareStandard  from 'app/renderer/main/modules/FileCompare/FileCompareStandard/FileCompareStandard.jsx';

export default React.createClass({
  render() {
    const { project, item } = this.props;

    const filePrevious = item && item.data && item.data.previousRevisionId
    ? i.assocIn(item, ['data', 'revisionId'], item.data.previousRevisionId)
    : null;

    return (
      <FileCompareStandard
        project={project.data}
        file1={item.data}
        file2={filePrevious ? filePrevious.data : null} />
    )
  }
})
