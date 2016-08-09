import React from 'react';
import codemirror from 'codemirror'
import codemirrorMode from 'codemirror/mode/meta.js'

export default class extends React.Component{
  componentDidMount() {
    const codemirrorEl = document.getElementById("codemirror");
    console.log(codemirrorMode);
    const editor = codemirror(codemirrorEl, {
      value: `
// require('codemirror/addon/hint/show-hint');
// require('codemirror/addon/hint/xml-hint');
// require('codemirror/addon/hint/html-hint');

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');

var CodeMirror = require('codemirror/lib/codemirror');

var editor = CodeMirror.fromTextArea(textareaElement, {
  mode: 'text/html',
  lineWrapping: true,
  extraKeys: {
    'Ctrl-Space': 'autocomplete'
  },
  lineNumbers: true,
  theme: 'monokai'
});`,
    lineNumbers: true,
      readOnly: true

    });
  }
  render() {
    return <div id="codemirror"></div>
  }
};
