import React from 'react';

import codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
const requireCodemirrorMode = require.context("codemirror/mode/", true);

export default class extends React.Component{
  componentDidMount() {
    const codemirrorEl = this.refs.codemirror;
    const editorInstance = codemirror(codemirrorEl, {
      value: this.props.fileData.data,
      indentWithTabs: true,
      readOnly: true,
      dragDrop: false,
      lineWrapping: true,
      lineNumbers: true,
    });

    // Get Mode
    const mode = codemirror.findModeByExtension(this.props.file.extension).mode;
    const modePath = `./${mode}/${mode}.js`
    requireCodemirrorMode(modePath);
    editorInstance.setOption("mode", mode);
  }
  render() {
    return <div className="scroll-box flex" ref="codemirror"></div>
  }
};
