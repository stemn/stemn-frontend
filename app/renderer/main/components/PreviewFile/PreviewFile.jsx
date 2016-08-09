import React from 'react';

import PreviewCode from './PreviewCode/PreviewCode'
// Styles
import classNames from 'classnames';

export default class extends React.Component{
  componentWillMount() {
    this.props.filesActions.getFile({
      projectStub: this.props.projectStub,
      path: this.props.path
    })
    this.props.filesActions.getMeta({
      projectStub: this.props.projectStub,
      path: this.props.path
    })
  }
  render() {
    console.log(this.props);
    const file = `// require('codemirror/addon/hint/show-hint');
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
});`

    const getPreview = () => {
      if(this.props.file.data && this.props.file.meta.fileType){
        return <PreviewCode model={this.props.file.data} fileType={this.props.file.meta.fileType} />
      }
    }

    return (
      <div>
        {this.props.file ? this.props.file.meta.name : ''}
        {getPreview()}
      </div>
    );
  }
};
