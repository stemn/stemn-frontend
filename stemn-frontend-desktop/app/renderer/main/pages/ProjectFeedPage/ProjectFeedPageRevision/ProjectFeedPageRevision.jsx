import React                from 'react'
import FileCompare          from 'stemn-shared/misc/FileCompare'

export default class ProjectFeedPageRevision extends React.Component {
  render() {
    const { project, item } = this.props

    //    const filePrevious = item && item.data && item.data.previousRevisionId
    //    ? i.assocIn(item, ['data', 'revisionId'], item.data.previousRevisionId)
    //    : null;

    return (
      <FileCompare
        project={ project.data }
        file={ item }
      />
    )
  }
}
