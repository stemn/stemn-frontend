import React from 'react';
import codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
const requireCodemirrorMode = require.context("codemirror/mode/", true);

export default class extends React.Component{
  componentDidMount() {
    const codemirrorEl = this.refs.codemirror;
    const editorInstance = codemirror(codemirrorEl, {
      value: this.props.model,
      indentWithTabs: true,
      readOnly: true,
      dragDrop: false,
      lineWrapping: true,
      lineNumbers: true,
    });

    // Get Mode
    const mode = codemirror.findModeByExtension(this.props.fileType).mode;
    const modePath = `./${mode}/${mode}.js`
    requireCodemirrorMode(modePath);
    editorInstance.setOption("mode", mode);
  }
  render() {
    return <div ref="codemirror"></div>
  }
};
