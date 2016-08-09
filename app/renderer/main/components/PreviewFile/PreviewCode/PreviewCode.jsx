import React from 'react';
import codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
const requireCodemirrorMode = require.context("codemirror/mode/", true);

export default class extends React.Component{
  componentDidMount() {
    const codemirrorEl = document.getElementById("codemirror");
    const editorInstance = codemirror(codemirrorEl, {
      value: this.props.model,
      lineNumbers: true,
      readOnly: true,
    });

    // Get Mode
    const mode = codemirror.findModeByExtension(this.props.fileType).mode;
    const modePath = `./${mode}/${mode}.js`
    requireCodemirrorMode(modePath);
    editorInstance.setOption("mode", mode);
  }
  render() {
    return <div id="codemirror"></div>
  }
};
