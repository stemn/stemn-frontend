import React from 'react';

import codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
const requireCodemirrorMode = require.context("codemirror/mode/", true);
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

export const Viewer = React.createClass({
  render() {
    const { data, extension } = this.props;

    if(data && extension){
      setTimeout(()=>{ // Give the component time to render (so we get refs)
        this.refs.codemirror.innerHTML = "";
        const editorInstance = codemirror(this.refs.codemirror, {
          value: data,
          indentWithTabs: true,
          readOnly: true,
          dragDrop: false,
          lineWrapping: true,
          lineNumbers: true,
        });
        // Get Mode
        const mode = codemirror.findModeByExtension(extension).mode;
        const modePath = `./${mode}/${mode}.js`
        requireCodemirrorMode(modePath);
        editorInstance.setOption("mode", mode);
      }, 1)
    }

    return (
      <div className="scroll-box flex" ref="codemirror"></div>
    )
  }
});


export default React.createClass({
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the previewId changes, download a new file
    if(!prevProps || nextProps.previewId !== prevProps.previewId){
      // If we don't already have the file, get it
      if(!nextProps.fileData){
        nextProps.downloadFn({
          projectId  : nextProps.fileMeta.project._id,
          fileId     : nextProps.fileMeta.fileId,
          revisionId : nextProps.fileMeta.revisionId
        })
      }
    }
  },
  render() {
    const { fileData, fileMeta } = this.props;
    return (
      <div className="layout-column flex">
        { fileData && fileData.data ? <Viewer extension={fileMeta.extension} data={fileData.data} /> : '' }
        { fileData ? <LoadingOverlay show={fileData.loading} /> : '' }
      </div>
    )
  }
});
