// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FilesActions from '../Files.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './PreviewFile.css';

// Sub Components
import PreviewCode        from './PreviewCode/PreviewCode'
import PreviewPcb         from './PreviewPcb/PreviewPcb'
import PreviewPdf         from './PreviewPdf/PreviewPdf'
import PreviewImage       from './PreviewImage/PreviewImage'
import PreviewCad         from './PreviewCad/PreviewCad'
//import PreviewCad         from './PreviewCad/AutodeskLocalViewer/AutodeskLocalViewer'
import PreviewGoogle      from './PreviewGoogle/PreviewGoogle'
import PreviewGdoc        from './PreviewGdoc/PreviewGdoc'
import LoadingOverlay     from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import laptopSpanner      from 'stemn-shared/assets/images/pure-vectors/laptop-spanner.svg';
import { getViewerType }  from './PreviewFile.utils.js'
import DownloadFile       from '../DownloadFile/DownloadFile.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { file, fileData, fileRender, filesActions, header } = this.props;
    const previewId = `${file.project._id}-${file.fileId}-${file.revisionId}`;

    const getPreview = () => {
      const viewerType = getViewerType(file.extension, file.provider);
      if(viewerType == 'gerber' || viewerType == 'pcb'){
        return <PreviewPcb previewId={previewId} fileMeta={file} fileData={fileData} downloadFn={filesActions.getFile} />
      }
      else if(viewerType == 'code'){
        return <PreviewCode previewId={previewId} fileMeta={file} fileData={fileData} downloadFn={filesActions.getFile}/>
      }
      else if(viewerType == 'autodesk'){
        return <PreviewCad previewId={previewId} fileMeta={file} fileRender={fileRender} renderFn={filesActions.renderFile}/>
      }
      else if(viewerType == 'google'){
        return <PreviewGoogle previewId={previewId} fileMeta={file} />
      }
      else if(viewerType == 'gdoc'){
        return <PreviewGdoc previewId={previewId} fileMeta={file} />
      }
      else if(viewerType == 'image'){
        return <PreviewImage previewId={previewId} fileMeta={file} fileData={fileData} downloadFn={filesActions.getFile} />
      }
      else if(viewerType == 'pdf'){
        return <PreviewPdf previewId={previewId} fileMeta={file} fileData={fileData} downloadFn={filesActions.getFile}/>
      }
      else{
        return (
          <div className="layout-column layout-align-center-center flex">
            <img src={laptopSpanner} style={{width: '100px'}}/>
            <div className="text-title-5 text-center" style={{marginTop: '10px'}}>Cannot preview this file type.</div>
          </div>
        )
      }
    }
    return (
      <div className="layout-column flex rel-box">
        { header
        ? <div className={classes.header + ' layout-row layout-align-start-center rel-box'}>
            <div>Version: {file.revisionNumber}</div>
            {/*<div>&nbsp;&nbsp;Created: {moment(file.modified).calendar()}</div>*/}
            <div className="flex"></div>
            <DownloadFile file={file} title={`Download Version ${file.revisionNumber} of this file.`}>Download</DownloadFile>
          </div>
        : null }
        {getPreview()}
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files}, {project, file}) {
  const cacheKey = `${file.fileId}-${file.revisionId}`;
  return {
    fileData  : files.fileData[cacheKey],
    fileRender: files.fileRenders[cacheKey],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
