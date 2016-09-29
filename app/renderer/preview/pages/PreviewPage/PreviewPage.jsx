// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Actions
import * as FilesActions from 'app/renderer/main/modules/Files/Files.actions.js';

// Sub Components
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileBreadCrumbs    from 'app/renderer/main/modules/FileList/components/FileBreadCrumbs.jsx'
// Styles
import classes from './PagePreview.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    const { revisionId, fileId} = this.props.params;
    if(fileId){
      this.props.filesActions.getMeta({fileId, revisionId})
    }
  },
  clickCrumb({file}){
    console.log(file);
  },
  render() {
    const { fileMeta } = this.props;
    console.log(fileMeta);
    return (
      <div className="layout-column flex">
        <div className={classes.header}>
          <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb}/>
        </div>
        <div className="layout-row flex">
          <div className="layout-column flex">
            {
              fileMeta && fileMeta.data
              ? <div className="layout-column flex">
                  <FileCompare
                    compareId={`preview-${fileMeta.data.fileId}}`}
                    project={fileMeta.data.project}
                    file1={fileMeta.data}/>
                </div>
              : ''
            }
            <Timeline className={classes.timeline}/>
          </div>
          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
            <aside className={classes.sidebar + ' layout-column flex'}>
              Lorem goes in here
            </aside>
          </DragResize>
        </div>
      </div>
    );
  }
});
//
//          items={timeline.data}
//          selected={timeline.selected._id}
//          onSelect={this.selectTimelineItem}

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files}, {params}) {
  const cacheKey = `${params.fileId}-${params.revisionId}`
  return {
    fileMeta: files.fileMeta[cacheKey]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
